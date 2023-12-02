import { expect, test } from "@playwright/test";

test("index page has expected h1", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("heading", { name: "🍔Food Matcher🍕" })).toBeVisible();
});

test("index page has expected button", async ({ page }) => {
	await page.goto("/");
	await expect(page.getByRole("button", { name: "New Matcher" })).toBeVisible();
});

test("should store a session cookie", async ({ page }) => {
	await page.goto("/");
	const cookies = await page.context().cookies();
	const sessionCookie = cookies.find((cookie) => cookie.name === "sessionid");
	expect(sessionCookie).toBeTruthy();
});

test("should create a new matcher and navigate to it", async ({ page }) => {
	await page.goto("/");
	await page.click("button:has-text('New Matcher')");
	await expect(page.getByRole("heading", { name: "Matcher" })).toBeVisible();
});
