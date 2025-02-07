import { test, expect } from 'playwright-test-coverage';

test('logout', async ({ page }) => {
  await page.route('**/api/auth', async (route) => {
    const method = route.request().method();

    if (method === 'PUT') {
      // login
      const loginReq = { email: 'a@jwt.com', password: 'admin' };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      const loginRes = {
        user: { id: 1, name: 'Admin User', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
        token: 'fake-token'
      };
      await route.fulfill({ json: loginRes });
    } else if (method === 'DELETE') {
      // logout
      await route.fulfill({ json: { message: 'logout successful' } });
    }
    
  });

  // login
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: /The web's best pizza/ })).toBeVisible();

  // logout
  await page.getByRole('link', { name: 'Logout' }).click();

  // try to order
  await page.getByRole('link', { name: 'Order' }).click();
});
