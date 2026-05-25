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

    public getInteractableLocator(): Locator {
        return this.getLocator().filter({ visible: true }).first();
    }

    public async waitForVisible(timeout: number = 10000) {
        await this.getInteractableLocator().waitFor({ state: 'visible', timeout });
    }

    public async waitForHidden(timeout: number = 10000) {
        await this.getLocator().first().waitFor({ state: 'hidden', timeout });
    }

    public async click() {
        await this.getInteractableLocator().click();
    }

    public async doubleClick() {
        await this.getInteractableLocator().dblclick();
    }

    public async rightClick() {
        await this.getInteractableLocator().click({ button: 'right' });
    }

    public async clear() {
        await this.getInteractableLocator().clear();
    }

    public async focus() {
        await this.getInteractableLocator().focus();
    }

    public async dragTo(destination: Locator) {
        await this.getInteractableLocator().dragTo(destination);
    }

    public async getText(): Promise<string> {
        return await this.getInteractableLocator().innerText();
    }

    public async isVisible(): Promise<boolean> {
        return await this.getInteractableLocator().isVisible();
    }
}
