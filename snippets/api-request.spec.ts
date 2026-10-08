import { test, expect } from '@playwright/test';

// The request fixture uses the configured baseURL; no browser is needed.
// Adapt status and response shape to your API contract.
test('read orders directly through the API', async ({ request }) => {
  const response = await request.get('/api/orders');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('application/json');
  const body: unknown = await response.json();
  expect(body).toEqual({ orders: expect.any(Array) });
});
