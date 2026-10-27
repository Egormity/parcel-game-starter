import { expect, type Page } from '@playwright/test';

export async function travel(page: Page, axis: 'x' | 'y', target: number) {
  const stage = page.getByTestId('game-stage');
  const origin = Number(await stage.getAttribute(`data-player-${axis}`));
  if (Math.abs(origin - target) < 12) return;
  const positive = target > origin;
  const key =
    axis === 'x' ? (positive ? 'ArrowRight' : 'ArrowLeft') : positive ? 'ArrowDown' : 'ArrowUp';
  await page.keyboard.down(key);
  try {
    await page.waitForFunction(
      ({ axis, target, positive }) => {
        const stage = document.querySelector('[data-testid="game-stage"]');
        if (stage?.getAttribute('data-phase') === 'won') return true;
        const current = Number(stage?.getAttribute(`data-player-${axis}`));
        return positive ? current >= target - 8 : current <= target + 8;
      },
      { axis, target, positive },
      { timeout: 6500 },
    );
  } finally {
    await page.keyboard.up(key);
  }
}

export async function completeRoute(page: Page, depotX: number, recipientX: number) {
  await page.getByRole('button', { name: 'Start route', exact: true }).click();
  for (const y of [128, 320, 512]) {
    await travel(page, 'y', 320);
    await travel(page, 'x', depotX);
    await travel(page, 'x', recipientX);
    await travel(page, 'y', y);
  }
  await expect(page.getByTestId('game-stage')).toHaveAttribute('data-phase', 'won');
  await expect(page.getByText('All 3 parcels delivered', { exact: false })).toBeVisible();
}
