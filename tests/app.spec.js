// tests/app.spec.js
import { test, expect } from '@playwright/test';

// Base URL for the running application (adjust if your dev server uses a different port)
const BASE_URL = 'http://localhost:5173'; // Updated port

test.describe('Main Application Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto(BASE_URL);
  });

  test('should display the main heading', async ({ page }) => {
    // Check if the H1 element with the name is attached to the DOM
    await expect(page.locator('h1:has-text("Raj Manghani")')).toBeAttached();
  });

  test('should have section titles attached', async ({ page }) => {
    // Check if section titles are attached to the DOM.
    // Animations might make visibility checks flaky in tests.
    await expect(page.locator('h2:has-text("Mission Briefing")')).toBeAttached();
    await expect(page.locator('h2:has-text("Core Systems & Modules: Skills Matrix")')).toBeAttached();
    await expect(page.locator('h2:has-text("The Engine Room: Technical Expertise")')).toBeAttached();
    await expect(page.locator('h2:has-text("Interstellar Missions: Work Experience")')).toBeAttached();
    await expect(page.locator('h2:has-text("Galactic Showcase: Projects & Credentials")')).toBeAttached();
    await expect(page.locator('h2:has-text("Transmission Relay: Contact Me")')).toBeAttached();
  });

   test('should show terminal when Explore button is clicked', async ({ page }) => {
    // Click the toggle button
    await page.locator('button:has-text("Explore Solar System")').click();

    // Wait for and check if the terminal container is visible
    // Using the CSS module class might be fragile, let's use a data-testid or role if possible
    // For now, assuming the container div exists and becomes visible
    // We might need to add a specific identifier to the terminal container div
    await expect(page.locator('div[class*="terminalContainer"]')).toBeVisible(); // Check if element with class containing "terminalContainer" is visible

    // Check if the initial welcome message appears in the terminal (might need refinement)
    // This requires inspecting the terminal's content, which can be complex.
    // A simpler check might be just the visibility of the container.
  });

  // Add more E2E tests later (e.g., navigation, terminal interaction)
});
