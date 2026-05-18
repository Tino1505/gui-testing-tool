import { BaseControl } from './base.control';

export class TextBoxControl extends BaseControl {
    public async fill(text: string) {
        // Use getWorkingLocator to support strict mode fallback if it exists
        // Wait, BaseControl's getWorkingLocator is private.
        // I will change it to protected in base.control.ts later.
        // For now, since fill() directly calls getLocator(), I will change BaseControl to have a protected getWorkingLocator().
        await this.getLocator().fill(text);
    }

    public async clear() {
        await this.getLocator().clear();
    }

    public async type(text: string, delayMs: number = 50) {
        await this.getLocator().pressSequentially(text, { delay: delayMs });
    }

    public async executeAction(action: string, actualData: string, step: any, targetId: string): Promise<string> {
        if (action === "input") {
            await this.waitForVisible();
            await this.clear();
            await this.fill(actualData);
            return `Input: '${actualData}' into ${targetId}`;
        }
        
        if (action === "type") {
            await this.waitForVisible();
            await this.type(actualData);
            return `Typed: '${actualData}' into ${targetId}`;
        }
        
        // Fallback to base actions (like click, verify, etc.)
        return super.executeAction(action, actualData, step, targetId);
    }
}
