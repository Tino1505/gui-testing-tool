import { Page, Locator } from 'playwright';

export class PlaywrightDriver {
    private static page: Page;

    public static setPage(page: Page) {
        this.page = page;
    }

    public static getPage(): Page {
        return this.page;
    }

    public static getLocator(locatorType: string, locatorValue: string): Locator {
        if (!locatorType) locatorType = "";
        locatorType = locatorType.toLowerCase().trim();

        if (locatorType === 'data-testid' || locatorType === 'data-test-id') return this.page.locator(`[data-testid="${locatorValue}"]`);
        if (locatorType === 'id') return this.page.locator(`id=${locatorValue}`);
        if (locatorType === 'css') return this.page.locator(locatorValue);
        if (locatorType === 'xpath') return this.page.locator(`xpath=${locatorValue}`);
        if (locatorType === 'name') return this.page.locator(`[name="${locatorValue}"]`);
        if (locatorType === 'class') return this.page.locator(`.${locatorValue.split(' ').join('.')}`); // basic class converter
        if (locatorType === 'tag') return this.page.locator(locatorValue);

        if (locatorValue.startsWith('/') || locatorValue.startsWith('//')) {
            return this.page.locator(`xpath=${locatorValue}`);
        }
        return this.page.locator(locatorValue);
    }

    public static async navigate(url: string) {
        await this.page.goto(url);
    }
}
