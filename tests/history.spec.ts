import { test, expect } from 'playwright-test-coverage';

test('view history and about page', async ({ page }) => {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      { id: 1, title: 'Veggie', image: 'pizza1.png', price: 0.0038, description: 'A garden of delight' },
      { id: 2, title: 'Pepperoni', image: 'pizza2.png', price: 0.0042, description: 'Spicy treat' },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise', async (route) => {
    const franchiseRes = [
      {
        id: 2,
        name: 'LotaPizza',
        stores: [
          { id: 4, name: 'Lehi' },
          { id: 5, name: 'Springville' },
          { id: 6, name: 'American Fork' },
        ],
      },
      { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
      { id: 4, name: 'topSpot', stores: [] },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

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
