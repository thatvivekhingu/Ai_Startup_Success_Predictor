import { chromium } from "playwright-core";

const baseUrl = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const csvPath = process.env.E2E_CSV_PATH || "C:\\tmp\\foundr-ai-smoke.csv";
const edgePath =
  process.env.E2E_BROWSER_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const browser = await chromium.launch({
  executablePath: edgePath,
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const consoleErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});

const bodyOverflow = () =>
  page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth + 1,
  );

try {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.waitForURL("**/dashboard");
  await page.getByText("Foundr.AI intelligence").waitFor();
  const dashboardOverflow = await bodyOverflow();
  await page.screenshot({
    path: "C:\\tmp\\foundr-dashboard-desktop.png",
    fullPage: true,
  });

  await page.goto(`${baseUrl}/team`, { waitUntil: "networkidle" });
  await page.getByText("Workspace accounts").waitFor();
  await page.getByText("demo@startupsignal.dev").waitFor();

  await page.goto(`${baseUrl}/settings`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Save appearance" }).click();
  await page.getByText("Preferences saved").waitFor();

  await page.getByRole("button", { name: "Sign out" }).click();
  await page.waitForURL("**/login");
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.waitForURL("**/dashboard");

  await page.goto(`${baseUrl}/predict`, { waitUntil: "networkidle" });
  await page.locator("#startup_name").fill("Browser Smoke Labs");
  await page.getByRole("button", { name: "Run prediction" }).click();
  await page.getByText("Why this score").waitFor();
  const predictionOverflow = await bodyOverflow();
  await page.screenshot({
    path: "C:\\tmp\\foundr-predict-desktop.png",
    fullPage: true,
  });

  const simulationResponse = page.waitForResponse(
    (response) => response.url().endsWith("/simulate") && response.ok(),
  );
  await page.locator("#scenario-growth_rate").fill("80");
  await simulationResponse;

  await page.getByRole("tab", { name: "CSV batch" }).click();
  await page.locator('input[type="file"]').setInputFiles(csvPath);
  await page.getByText("Data quality findings").waitFor();
  await page.getByRole("button", { name: /Predict 1 rows/ }).click();
  await page.getByText("Batch results").waitFor();
  await page.screenshot({
    path: "C:\\tmp\\foundr-csv-desktop.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
  await page.getByText("Foundr.AI intelligence").waitFor();
  const mobileOverflow = await bodyOverflow();
  await page.screenshot({
    path: "C:\\tmp\\foundr-dashboard-mobile.png",
    fullPage: true,
  });

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/register`, { waitUntil: "networkidle" });
  await page.locator('input[name="username"]').fill("smoke.analyst");
  await page.locator('input[name="email"]').fill("smoke@example.com");
  await page.locator('input[name="password"]').fill("initialpass");
  await page.locator('input[name="confirm_password"]').fill("initialpass");
  await page.getByRole("button", { name: "Create account" }).click();
  await page.waitForURL("**/home");

  await page.goto(`${baseUrl}/settings`, { waitUntil: "networkidle" });
  await page.getByLabel("Username").fill("smoke.renamed");
  await page.getByLabel("Email").fill("renamed@example.com");
  await page.getByRole("button", { name: "Save profile" }).click();
  await page.getByText("Profile updated").waitFor();
  await page.getByLabel("Current password").fill("initialpass");
  await page.getByLabel("New password", { exact: true }).fill("replacementpass");
  await page.getByLabel("Confirm password").fill("replacementpass");
  await page.getByRole("button", { name: "Change password" }).click();
  await page.getByText("Password changed").waitFor();

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.locator('input[name="username"]').fill("smoke.renamed");
  await page.locator('input[name="password"]').fill("replacementpass");
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await page.waitForURL("**/dashboard");

  await page.evaluate(() => {
    localStorage.setItem("ss_token", "expired-token");
    localStorage.setItem(
      "ss_user",
      JSON.stringify({ id: 999, username: "expired", role: "analyst" }),
    );
  });
  await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForURL("**/login");

  const result = {
    dashboardOverflow,
    predictionOverflow,
    mobileOverflow,
    consoleErrors,
  };
  console.log(JSON.stringify(result));
  if (
    dashboardOverflow ||
    predictionOverflow ||
    mobileOverflow ||
    consoleErrors.length
  ) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
