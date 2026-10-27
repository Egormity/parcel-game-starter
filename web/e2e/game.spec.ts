import { expect, test } from '@playwright/test';
import { completeRoute, travel } from './helpers';

test('completes both routes using real keyboard input and retains a best time', async ({
  page,
}) => {
  test.setTimeout(100_000);
  const errors: string[] = [];
  const external: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4432')) external.push(request.url());
  });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start route', exact: true })).toBeEnabled();
  await page.screenshot({ path: '.playwright/desktop-ready.png', fullPage: true });
  await completeRoute(page, 160, 800);
  await page.screenshot({ path: '.playwright/desktop-complete.png', fullPage: true });
  await page.getByRole('button', { name: 'Next route', exact: true }).click();
  await expect(page.getByTestId('game-stage')).toHaveAttribute('data-phase', 'ready');
  await completeRoute(page, 800, 160);
  const records = await page.evaluate(() =>
    Object.entries(localStorage).filter(([key]) => key.includes('parcel')),
  );
  const bestTimes = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('parcel.best.v1') ?? '{}'),
  );
  expect(bestTimes['maple-quarter']).toBeGreaterThan(0);
  expect(bestTimes['garden-district']).toBeGreaterThan(0);
  await page.reload();
  expect(
    await page.evaluate(() =>
      Object.entries(localStorage).filter(([key]) => key.includes('parcel')),
    ),
  ).toEqual(records);
  await expect(page.locator('canvas')).toHaveCount(1);
  expect(errors).toEqual([]);
  expect(external).toEqual([]);
});

test('solid buildings block movement; pause, blur, restart and scene replacement clear input', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start route', exact: true }).click();
  const stage = page.getByTestId('game-stage');
  await travel(page, 'x', 310);
  await page.keyboard.down('ArrowUp');
  await page.waitForTimeout(700);
  await page.keyboard.up('ArrowUp');
  const y = Number(await stage.getAttribute('data-player-y'));
  expect(y).toBeGreaterThanOrEqual(260);
  expect(y).toBeLessThan(280);
  await page.getByRole('button', { name: 'Pause', exact: true }).click();
  await expect(stage).toHaveAttribute('data-phase', 'paused');
  const time = await page.getByTestId('route-time').innerText();
  await page.waitForTimeout(1100);
  await expect(page.getByTestId('route-time')).toHaveText(time);
  await page.getByRole('button', { name: 'Continue route', exact: true }).click();
  await page.keyboard.down('ArrowRight');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.keyboard.up('ArrowRight');
  await expect(stage).toHaveAttribute('data-phase', 'paused');
  await page.getByRole('button', { name: 'Continue route', exact: true }).click();
  const x = Number(await stage.getAttribute('data-player-x'));
  await page.waitForTimeout(300);
  expect(Math.abs(Number(await stage.getAttribute('data-player-x')) - x)).toBeLessThan(5);
  await page.keyboard.press('Escape');
  await expect(stage).toHaveAttribute('data-phase', 'paused');
  await page.getByRole('button', { name: /^Restart/ }).click();
  await expect(stage).toHaveAttribute('data-phase', 'ready');
  await expect(stage).toHaveAttribute('data-player-x', '96');
  for (const name of ['Garden District', 'Maple Quarter', 'Garden District']) {
    await page.getByRole('button', { name: new RegExp(name) }).click();
    await expect(page.locator('canvas')).toHaveCount(1);
    await expect(stage).toHaveAttribute('data-phase', 'ready');
  }
});

test('plays without WebGL or persistent storage', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]).startsWith('webgl')) return null;
      return original.apply(this, args);
    } as typeof original;
    Storage.prototype.getItem = () => {
      throw new DOMException('Storage blocked', 'SecurityError');
    };
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage blocked', 'SecurityError');
    };
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Start route', exact: true }).click();
  await travel(page, 'x', 220);
  await expect(page.getByTestId('game-stage')).toHaveAttribute('data-phase', 'playing');
});

test('shows a recoverable error if a 2D canvas cannot be created', async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof original>) {
      if (String(args[0]) === '2d' && !sessionStorage.getItem('canvas-recovered')) return null;
      return original.apply(this, args);
    } as typeof original;
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toBeVisible();
  await page.evaluate(() => sessionStorage.setItem('canvas-recovered', 'yes'));
  await page.getByRole('button', { name: 'Try again', exact: false }).click();
  await page.getByRole('button', { name: 'Start route', exact: true }).click();
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('touch movement cancels cleanly and the phone layout fits', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4432/');
  await page.getByRole('button', { name: 'Start route', exact: true }).click();
  const right = page.getByRole('button', { name: 'Move right', exact: true });
  await right.scrollIntoViewIfNeeded();
  const rect = (await right.boundingBox())!;
  const stage = page.getByTestId('game-stage');
  const startX = Number(await stage.getAttribute('data-player-x'));
  const session = await context.newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }],
  });
  await expect
    .poll(async () => Number(await stage.getAttribute('data-player-x')))
    .toBeGreaterThan(startX + 60);
  await session.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await page.waitForTimeout(150);
  const stoppedX = Number(await stage.getAttribute('data-player-x'));
  await page.waitForTimeout(300);
  expect(Math.abs(Number(await stage.getAttribute('data-player-x')) - stoppedX)).toBeLessThan(5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  await stage.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '.playwright/mobile-playing.png' });
  await context.close();
});
