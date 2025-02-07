import { test, expect } from 'playwright-test-coverage';

test('franchise store management', async ({ page }) => {
  // login franchise
  await page.route('**/api/auth', async (route) => {
    const method = route.request().method();
    if (method === 'PUT') {
      // Expect a login attempt with franchise credentials.
      const loginReq = { email: 'f@jwt.com', password: 'franchisee' };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      const loginRes = {
        user: { id: 1, name: 'Franchise User', email: 'f@jwt.com', roles: [{ role: 'franchise' }] },
        token: 'fake-token'
      };
      await route.fulfill({ json: loginRes });
    } else {
      await route.fulfill({ status: 404, json: { error: 'Not implemented in test' } });
    }
  });

  // mock franchise data
  await page.route('**/api/franchise/*', async (route) => {
    console.log('Intercepted request:', route.request().url());
    if (route.request().method() === 'GET') {
      await route.fulfill({
        json: [{ id: 1, name: 'pizzaPocket', stores: [{ id: 100, name: 'Existing Store' }] }]
      });
    } else {
      await route.fulfill({ status: 404, json: { error: 'Not implemented in test' } });
    }
  });
  

  // make new franchise called kenz
  await page.route('**/api/franchise', async (route) => {
    const postData = route.request().postDataJSON();
    expect(postData).toMatchObject({ name: 'kenz', franchiseId: 1 });

    // Return the created store
    const newStore = { id: 101, name: 'kenz' };
    await route.fulfill({ json: newStore });
  });

//   // delete
//   await page.route('**/api/franchise/:franchiseId', async (route) => {
//     await route.fulfill({ status: 200, json: { message: 'Store deleted' } });
//   });

  await page.goto('/');

  // Login
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: /The web's best pizza/ })).toBeVisible();

  // franchise list and make franchise
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('pizzaPocket')).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('kenz');
  await page.getByRole('button', { name: 'Create' }).click();


});
