import { test, expect } from 'playwright-test-coverage';

test('register', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'k@jwt.com', password: '123' };
        const loginRes = { user: { id: 3, name: 'kenseyT', email: 'k@jwt.com', roles: [{ role: 'diner' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('POST');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
      });
    await page.goto('/');
    await page.getByRole('link', { name: 'Register', exact: true }).click();
    await page.getByRole('textbox', { name: 'Full name' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('kenseyT');
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('k@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('123');
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
    await expect(page.locator('.w-screen')).toBeVisible();
});

// // admin dashboard viewing
  // await page.getByRole('link', { name: 'Admin' }).click();
  // await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  // await expect(page.locator('thead')).toContainText('Franchise');
  // await page.getByRole('row', { name: 'pizzaPocket' }).getByRole('button').click();
  // await page.getByText('Sorry to see you go').click();
  test('admin page', async ({ page }) => {
    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 'k@jwt.com', password: '123' };
        const loginRes = { user: { id: 3, name: 'kenseyT', email: 'k@jwt.com', roles: [{ role: 'admin' }] }, token: 'abcdef' };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
      });
      await page.goto('/');
      // Login
      await page.getByRole('link', { name: 'Login' }).click();
      await expect(page.getByText('Welcome back')).toBeVisible();
      await page.getByRole('textbox', { name: 'Email address' }).fill('k@jwt.com');
      await page.getByRole('textbox', { name: 'Password' }).fill('123');
      await page.getByRole('button', { name: 'Login' }).click();
      await expect(page.getByRole('heading', { name: /The web's best pizza/ })).toBeVisible();
      await page.getByRole('link', { name: 'Admin' }).click();
      await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
      await expect(page.locator('thead')).toContainText('Franchise');
      await page.getByRole('row', { name: 'pizzaPocket' }).getByRole('button').click();
      await page.getByText('Sorry to see you go').click();
});
