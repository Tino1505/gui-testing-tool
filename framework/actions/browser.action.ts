import { PlaywrightDriver } from '../drivers/playwright.wrapper';
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

    public static async switchTab(): Promise<string> {
        return "Switched tab (not implemented yet)";
    }
}
