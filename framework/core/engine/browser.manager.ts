import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { PlaywrightDriver } from '../drivers/playwright.wrapper';

export class BrowserManager {
    private browser: Browser | null = null;
    private context: BrowserContext | null = null;
    private page: Page | null = null;

    public async start(headless: boolean = false): Promise<Page> {
        this.browser = await chromium.launch({
            headless: headless,
            args: [
                '--start-maximized',
                '--disable-gpu',
                '--no-sandbox',
                '--disable-dev-shm-usage'
            ]
        });

        this.context = await this.browser.newContext({
            viewport: null // to allow maximize
        });

        this.page = await this.context.newPage();
        
        // Cài đặt page cho PlaywrightMethod wrapper
        PlaywrightDriver.setPage(this.page);
        
        return this.page;
    }

    public async resetContext(headless: boolean = false): Promise<Page> {
        if (!this.browser) {
            return await this.start(headless);
        }
        if (this.page) {
            await this.page.close().catch(() => {});
            this.page = null;
        }
        if (this.context) {
            await this.context.close().catch(() => {});
            this.context = null;
        }
        this.context = await this.browser.newContext({
            viewport: null
        });
        this.page = await this.context.newPage();
        PlaywrightDriver.setPage(this.page);
        return this.page;
    }

    public async stop() {
        if (this.page) await this.page.close().catch(() => {});
        if (this.context) await this.context.close().catch(() => {});
        if (this.browser) await this.browser.close().catch(() => {});
        
        this.page = null;
        this.context = null;
        this.browser = null;
    }
}
