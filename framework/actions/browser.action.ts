import { PlaywrightDriver } from '../core/drivers/playwright.wrapper';
export class BrowserAction {
    public static async navigate(targetId: string, pagesDict: any): Promise<string> {
        const page = pagesDict[targetId];
        if (!page) throw new Error(`Page ID '${targetId}' not found in OBJECT_REPOSITORY.`);

        const url = page.url;
        const pageName = page.name || targetId;

        if (!url) {
            return `Navigated: ${pageName} (No static URL)`;
        } else {
            await PlaywrightDriver.navigate(url);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return `Navigated: ${pageName}`;
        }
    }

    public static async refresh(): Promise<string> {
        await PlaywrightDriver.getPage().reload();
        return "Refreshed page";
    }


    public static async goBack(): Promise<string> {
        await PlaywrightDriver.getPage().goBack();
        return "Went back to previous page";
    }

    public static async goForward(): Promise<string> {
        await PlaywrightDriver.getPage().goForward();
        return "Went forward to next page";
    }

    public static async screenshot(filenamePrefix: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const page = PlaywrightDriver.getPage();

        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => { });

        await page.screenshot({ path: `manual_${filenamePrefix}_${timestamp}.png`, fullPage: true });
        return `Captured manual screenshot: manual_${filenamePrefix}_${timestamp}.png`;
    }
}
