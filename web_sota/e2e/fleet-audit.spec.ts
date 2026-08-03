import { expect, test } from "@playwright/test";

const BE = "http://127.0.0.1:10922";
const FE = "http://127.0.0.1:10988";

test.describe("Fleet Audit", () => {
	test("Backend health", async ({ request }) => {
		const resp = await request.get(`${BE}/health`);
		expect(resp.status()).toBe(200);
		const body = await resp.json();
		expect(body.status).toBe("healthy");
	});

	test("Backend diagnostics", async ({ request }) => {
		const resp = await request.get(`${BE}/api/v1/diagnostics`);
		expect(resp.status()).toBe(200);
		const body = await resp.json();
		expect(body.tools.length).toBeGreaterThanOrEqual(5);
	});

	test("Life overview endpoint", async ({ request }) => {
		const resp = await request.get(`${BE}/api/life/overview`);
		expect(resp.status()).toBe(200);
		const body = await resp.json();
		expect(body.ok).toBe(true);
		expect(Array.isArray(body.active_medications)).toBe(true);
	});

	test("Frontend loads without console errors", async ({ page }) => {
		const errors: string[] = [];
		page.on("console", (msg) => {
			if (msg.type() === "error") errors.push(msg.text());
		});
		page.on("pageerror", (err) => errors.push(err.message));
		await page.goto(FE, { timeout: 15000 });
		await page.waitForTimeout(3000);
		await expect(page.locator("#root")).toBeAttached();
		expect(errors).toEqual([]);
	});

	test("Health page renders", async ({ page }) => {
		await page.goto(`${FE}/health`, { timeout: 15000 });
		await expect(page.locator('[data-testid="health-page"]')).toBeAttached();
		await expect(
			page.locator('[data-testid="kpi-active-meds"]'),
		).toBeAttached();
	});

	test("Contacts page renders", async ({ page }) => {
		await page.goto(`${FE}/contacts`, { timeout: 15000 });
		await expect(page.locator('[data-testid="contacts-page"]')).toBeAttached();
	});

	test("Household page renders", async ({ page }) => {
		await page.goto(`${FE}/household`, { timeout: 15000 });
		await expect(page.locator('[data-testid="household-page"]')).toBeAttached();
	});

	test("Journal page renders with streak", async ({ page }) => {
		await page.goto(`${FE}/journal`, { timeout: 15000 });
		await expect(page.locator('[data-testid="journal-page"]')).toBeAttached();
		await expect(page.locator('[data-testid="journal-streak"]')).toBeAttached();
	});

	test("Journal entry round-trip", async ({ request }) => {
		const r = await request.post(`${BE}/api/life/logs`, {
			data: { title: "e2e entry", body: "playwright", mood: 8, tags: "e2e" },
		});
		expect(r.status()).toBe(200);
		const { item } = await r.json();
		const del = await request.delete(`${BE}/api/life/logs/${item.id}`);
		expect(del.status()).toBe(200);
	});

	test("News page renders (aiwatcher bridge)", async ({ page }) => {
		await page.goto(`${FE}/news`, { timeout: 15000 });
		await expect(page.locator('[data-testid="news-page"]')).toBeAttached();
		await expect(page.locator('[data-testid="news-search"]')).toBeAttached();
	});

	test("Notes page renders (onenote bridge, offline-safe)", async ({ page }) => {
		await page.goto(`${FE}/notes`, { timeout: 15000 });
		await expect(page.locator('[data-testid="notes-page"]')).toBeAttached();
		await expect(page.locator('[data-testid="notes-search"]')).toBeAttached({
			timeout: 15000,
		});
	});

	test("Email page renders (email-mcp bridge, offline-safe)", async ({ page }) => {
		await page.goto(`${FE}/email`, { timeout: 15000 });
		await expect(page.locator('[data-testid="email-page"]')).toBeAttached();
		await expect(page.locator('[data-testid="email-search"]')).toBeAttached({
			timeout: 15000,
		});
	});

	test("Dashboard shows life pulse", async ({ page }) => {
		await page.goto(FE, { timeout: 15000 });
		await expect(page.locator('[data-testid="dashboard"]')).toBeAttached();
		await page.waitForTimeout(2500);
		await expect(page.locator('[data-testid="pulse-meds"]')).toBeAttached();
	});
});
