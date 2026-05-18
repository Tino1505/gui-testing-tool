import { Locator } from 'playwright';
import { PlaywrightDriver } from '../../drivers/playwright.driver';
import { SleepUtil } from '../../utils/sleep.util';

export class BaseControl {
    protected locatorType: string;
    protected locatorValue: string;

    constructor(locatorType: string, locatorValue: string) {
        this.locatorType = locatorType;
        this.locatorValue = locatorValue;
    }

    protected getLocator(): Locator {
        return PlaywrightDriver.getLocator(this.locatorType, this.locatorValue);
    }

    private async getWorkingLocator(): Promise<Locator> {
        const loc = this.getLocator();
        try {
            // Attempt to count. If it doesn't throw, we have a valid locator
            const count = await loc.count();
            if (count > 1) {
                // Return the first visible one if multiple exist
                for (let i = 0; i < count; i++) {
                    if (await loc.nth(i).isVisible()) {
                        return loc.nth(i);
                    }
                }
                return loc.first();
            }
            return loc;
        } catch {
            return loc;
        }
    }

    public async click() {
        const loc = await this.getWorkingLocator();
        await loc.click();
    }

    public async clickFirst() {
        await this.getLocator().first().click();
    }

    public async rightClick() {
        const loc = await this.getWorkingLocator();
        await loc.click({ button: 'right' });
    }

    public async dblclick() {
        const loc = await this.getWorkingLocator();
        await loc.dblclick();
    }

    public async hover() {
        const loc = await this.getWorkingLocator();
        await loc.hover();
    }

    public async scrollIntoViewIfNeeded() {
        const loc = await this.getWorkingLocator();
        await loc.scrollIntoViewIfNeeded();
    }

    public async setInputFiles(files: string | string[]) {
        const loc = await this.getWorkingLocator();
        await loc.setInputFiles(files);
    }

    public async getText(): Promise<string> {
        const loc = await this.getWorkingLocator();
        return await loc.innerText();
    }

    public async getAttribute(attr: string): Promise<string | null> {
        const loc = await this.getWorkingLocator();
        return await loc.getAttribute(attr);
    }

    public async isVisible(): Promise<boolean> {
        const count = await this.getLocator().count();
        if (count > 1) {
            for (let i = 0; i < count; i++) {
                if (await this.getLocator().nth(i).isVisible()) return true;
            }
            return false;
        }
        return await this.getLocator().isVisible();
    }

    public async waitForVisible(timeoutMs: number = 10000) {
        // waitFor cannot use getWorkingLocator directly if none are visible yet,
        // because getWorkingLocator checks currently visible elements.
        // Instead, we catch the strict mode violation.
        const loc = this.getLocator();
        try {
            await loc.waitFor({ state: 'visible', timeout: timeoutMs });
        } catch (e: any) {
            if (e.message && e.message.includes('strict mode violation')) {
                // If strict mode, wait for the first one to be visible, or we wait 
                // in a loop for ANY of them to become visible.
                // A simpler approach for Playwright is to just take the first one.
                await loc.first().waitFor({ state: 'visible', timeout: timeoutMs });
            } else {
                throw e;
            }
        }
    }

    public async waitForHidden(timeoutMs: number = 10000) {
        const loc = this.getLocator();
        try {
            await loc.waitFor({ state: 'hidden', timeout: timeoutMs });
        } catch (e: any) {
            if (e.message && e.message.includes('strict mode violation')) {
                // If there are multiple, wait for ALL to be hidden
                const count = await loc.count();
                for (let i = 0; i < count; i++) {
                    await loc.nth(i).waitFor({ state: 'hidden', timeout: timeoutMs });
                }
            } else {
                throw e;
            }
        }
    }

    public async executeAction(action: string, actualData: string, step: any, targetId: string): Promise<string> {
        const controlName = this.constructor.name;
        
        if (action === "wait") {
            if (this.locatorValue) {
                await this.waitForVisible(10000);
                return `Waited for element ${targetId}`;
            } else {
                await SleepUtil.sleep(3000);
                return `Waited for 3 seconds`;
            }
        }
        
        switch (action) {
            // Mouse Actions
            case "click":
                await this.waitForVisible();
                await this.click();
                return `Clicked ${targetId}`;
            case "click_first":
                await this.clickFirst();
                return `Clicked first ${targetId}`;
            case "double_click":
                await this.dblclick();
                return `Double clicked ${targetId}`;
            case "right_click":
                await this.rightClick();
                return `Right clicked ${targetId}`;
            case "hover":
                await this.hover();
                return `Hovered over ${targetId}`;
            case "scroll_to":
                await this.scrollIntoViewIfNeeded();
                return `Scrolled to ${targetId}`;
                
            // Validation Actions
            case "verify_visible":
                const isVisible = await this.isVisible();
                if (isVisible) return `visible`;
                throw new Error(`invisible`);
                
            case "check_status": {
                const expected = String(step.Expected || step.expected || "").toLowerCase().trim();
                if (expected === "invisible") {
                    try {
                        await this.waitForHidden(5000);
                        return "invisible";
                    } catch (e: any) {
                        if (e.message && e.message.includes('strict mode violation')) {
                            throw new Error(`strict mode violation: multiple elements found`);
                        }
                        throw new Error("visible");
                    }
                } else {
                    try {
                        await this.waitForVisible(5000);
                        return "visible";
                    } catch (e: any) {
                        if (e.message && e.message.includes('strict mode violation')) {
                            throw new Error(`strict mode violation: multiple elements found`);
                        }
                        if (e.message && !e.message.includes('Timeout')) {
                            throw new Error(`invalid selector or error: ${e.message}`);
                        }
                        throw new Error("invisible");
                    }
                }
            }
            
            case "verify":
            case "verify_text":
            case "check": {
                await this.waitForVisible();
                let actualText = await this.getText();
                if (!actualText || actualText.trim() === "") {
                    actualText = await this.getAttribute("value") || "";
                }
                actualText = actualText.trim();
                let expectedText = String(step.Expected || step.expected || "").trim();
                if (!expectedText || expectedText === 'n.a' || expectedText === 'None') {
                    expectedText = String(actualData).trim();
                }
                if (actualText === expectedText) {
                    return `Verified text matches: '${expectedText}'`;
                } else {
                    throw new Error(`Text mismatch. Expected '${expectedText}', Got '${actualText}'`);
                }
            }
                
            default:
                throw new Error(`Action '${action}' is not supported by ${controlName}.`);
        }
    }
}
