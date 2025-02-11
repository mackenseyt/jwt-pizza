import { test, expect } from 'playwright-test-coverage';

test('franchise store management', async ({ page }) => {
  // login franchise
  await page.route('**/api/auth', async (route) => {
    const loginReq = { email: 'f@jwt.com', password: 'franchisee' };
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    const loginRes = {
      user: { id: 1, name: 'Franchise User', email: 'f@jwt.com', roles: [{ role: 'franchise' }] },
      token: 'fake-token'
    };
    await route.fulfill({ json: loginRes });
  });

  // mock franchise data
  await page.route('**/api/franchise/*', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        json: [
          { id: 1, name: 'pizzaPocket', stores: [{ id: 100, name: 'Existing Store' }] }
        ]
      });
    }else if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON();
      expect(postData).toMatchObject({ name: 'kenz', franchiseId: 1 });
      await route.fulfill({ json: { id: 101, name: 'kenz' } });
    }
  });

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

test('create a new franchise', async ({ page }) => {
  //the POST request 
  await page.route('**/api/franchise', async (route) => {
    if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON();
      expect(postData).toMatchObject({
        name: 'pizzaPocket',
        admins: [{ email: 'f@jwt.com' }],
      });
      await route.fulfill({
        json: {
          name: 'pizzaPocket',
          admins: [
            { email: 'f@jwt.com', id: 4, name: 'pizza franchisee' }
          ],
          id: 1
        }
      });
    } else {
      await route.continue();
    }
  });

  // create a franchise
  await page.goto('/create-franchise');
  await expect(page.getByRole('heading', { name: 'Create franchise' })).toBeVisible();
  await page.getByPlaceholder('franchise name').fill('pizzaPocket');
  await page.getByPlaceholder('franchisee admin email').fill('f@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

});

