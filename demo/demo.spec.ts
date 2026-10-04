import path from 'node:path';
import { expect, test } from '@playwright/test';

const pause = (page: import('@playwright/test').Page, milliseconds = 1_500) => page.waitForTimeout(milliseconds);

test('records the confirmed receipt workflow', async ({ page }) => {
  page.on('dialog', (dialog) => dialog.accept());
  await page.goto('/');

  await expect(page.getByText('Interactive demo mode')).toBeVisible();
  await expect(page.getByText('$159.50', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('2', { exact: true })).toBeVisible();
  await pause(page, 2_000);

  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByText('Choose image', { exact: true }).click();
  const chooser = await chooserPromise;
  await chooser.setFiles({
    name: 'sample-receipt.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('BizExpense deterministic demo receipt'),
  });

  await expect(page.getByText('Review OCR result')).toBeVisible();
  await expect(page.getByText('OCR confidence: 94%', { exact: false })).toBeVisible();
  const fields = page.locator('input');
  await expect(fields.nth(0)).toHaveValue('Harbour Café');
  await expect(fields.nth(2)).toHaveValue('27.18');
  await expect(fields.nth(3)).toHaveValue('2.72');
  await expect(fields.nth(4)).toHaveValue('29.9');

  // OCR is still a draft here, so Dashboard KPIs must remain unchanged.
  await expect(page.getByText('$159.50', { exact: true }).first()).toBeVisible();
  await pause(page, 2_000);

  await fields.nth(5).fill('Team lunch receipt');
  await page.getByText('Meals', { exact: true }).click();
  await pause(page, 1_000);
  await page.getByText('Confirm expense', { exact: true }).click();

  await expect(page.getByText('$189.40', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('$17.22', { exact: true })).toBeVisible();
  await expect(page.getByText('3', { exact: true })).toBeVisible();
  await pause(page, 2_000);

  await page.getByText('Expenses', { exact: true }).click();
  await expect(page.getByText('Harbour Café', { exact: true })).toBeVisible();
  await page.getByText('Harbour Café', { exact: true }).click();
  await expect(page.getByText('Team lunch receipt', { exact: true })).toBeVisible();
  await pause(page, 1_500);
  await page.getByText('Close', { exact: true }).click();

  await page.getByText('Dashboard', { exact: true }).click();
  await expect(page.getByText('$189.40', { exact: true }).first()).toBeVisible();
  await pause(page, 2_000);

  const video = page.video();
  await page.close();
  await video?.saveAs(path.join(__dirname, 'recordings', 'bizexpense-demo.webm'));
});
