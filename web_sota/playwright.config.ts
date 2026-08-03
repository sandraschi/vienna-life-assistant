import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 60000,
    retries: 1,
    use: {
        baseURL: 'http://127.0.0.1:10988',
        headless: true,
        screenshot: 'only-on-failure',
    },
    webServer: [
        {
            command: 'uv run python -m vienna_life_assistant.server',
            port: 10922,
            cwd: '.',
            timeout: 30000,
            reuseExistingServer: true,
        },
        {
            command: 'npx vite --port 10988 --host 127.0.0.1',
            port: 10988,
            cwd: '.',
            timeout: 30000,
            reuseExistingServer: true,
        },
    ],
});
