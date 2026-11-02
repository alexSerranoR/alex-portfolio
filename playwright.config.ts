import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  fullyParallel: false,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    // Set PLAYWRIGHT_CHROMIUM to use a local Chromium build instead of Chrome.
    ...(process.env.PLAYWRIGHT_CHROMIUM ? {} : { channel: "chrome" }),
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM,
      // Software WebGL, so the library scene renders on machines without a GPU.
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
