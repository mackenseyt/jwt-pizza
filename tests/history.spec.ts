import { test, expect } from 'playwright-test-coverage';

test('view history and about page', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'a@jwt.com', password: 'admin' };
      expect(route.request().postDataJSON()).toMatchObject(loginReq);
      const loginRes = {
        user: { id: 1, name: 'Admin User', email: 'a@jwt.com', roles: [{ role: 'admin' }] },
        token: 'fake-token'
      };
      await route.fulfill({ json: loginRes });
  });
//   login
  await page.goto('/');
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();

  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

// history page
await page.getByRole('link', { name: 'History' }).click();
await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
await page.getByRole('link', { name: 'About' }).click();
await expect(page.getByText('The secret sauce')).toBeVisible();
await page.getByRole('link', { name: 'Franchise' }).click();
await expect(page.getByText('If you are already a')).toBeVisible();
});
