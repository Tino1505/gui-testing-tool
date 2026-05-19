import { PlaywrightDriver } from '../core/drivers/playwright.wrapper';
import { Locator } from 'playwright';
export class BaseControl {
    protected locatorType: string;
    protected locatorValue: string;

    constructor(locatorType: string, locatorValue: string) {
        this.locatorType = locatorType;
        this.locatorValue = locatorValue;
    }

    public getLocator(): Locator {
        return PlaywrightDriver.getLocator(this.locatorType, this.locatorValue);
    }

    public async waitForVisible(timeout: number = 10000) {
        await this.getLocator().waitFor({ state: 'visible', timeout });
    }

    public async waitForHidden(timeout: number = 10000) {
        await this.getLocator().waitFor({ state: 'hidden', timeout });
    }

    public async click() {
        await this.getLocator().click();
    }

    public async doubleClick() {
        await this.getLocator().dblclick();
    }

    public async rightClick() {
        await this.getLocator().click({ button: 'right' });
    }

    public async clear() {
        await this.getLocator().clear();
    }

    public async focus() {
        await this.getLocator().focus();
    }

    public async dragTo(destination: Locator) {
        await this.getLocator().dragTo(destination);
    }

    public async getText(): Promise<string> {
        return await this.getLocator().innerText();
    }

    public async isVisible(): Promise<boolean> {
        return await this.getLocator().isVisible();
    }

    public async executeAction(action: string, actualData: string, step: any, targetId: string): Promise<string> {
        if (action === "click") {
            await this.waitForVisible();
            await this.click();
            await new Promise(resolve => setTimeout(resolve, 500));
            return `Clicked on ${targetId}`;
        }
        
        if (action === "verify_visible") {
            const isVis = await this.isVisible();
            if (!isVis) throw new Error("Element not visible");
            return `Verified ${targetId} is visible`;
        }

        if (action === "verify_text") {
            await this.waitForVisible();
            const text = await this.getText();
            if (!text.includes(actualData)) {
                throw new Error(`Text mismatch. Expected: ${actualData}, Actual: ${text}`);
            }
            return `Verified text for ${targetId}`;
        }

        if (action === "wait") {
            await new Promise(resolve => setTimeout(resolve, Number(actualData) || 2000));
            return `Wait for ${actualData}ms`;
        }

        throw new Error(`Action '${action}' is not supported on this control.`);
    }
}
