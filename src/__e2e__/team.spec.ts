import { expect, test } from '@playwright/test';

test('should navigate to the team page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/');
  // Find an element with the text 'Team' and click on it
  await page.click('text=Team');
  // The new URL should be "/team" (baseURL is used there)
  await expect(page).toHaveURL('http://localhost:3000/team');
  // The new page should contain an h1 with "Meet the (Team)"
  await expect(page.locator('h1')).toContainText('Meet the');
  // Check if the page contains a list of team members
  const teamMembers = page.locator('ul.team-list li');
  await expect(teamMembers).toHaveCount(11); // Adjust the count based on your
});
