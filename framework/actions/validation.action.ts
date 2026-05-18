import { BaseControl } from '../controls/base.control';

export class ValidationAction {
    public static async verifyVisible(control: BaseControl, targetId: string): Promise<string> {
        const isVis = await control.isVisible();
        if (!isVis) throw new Error("Element not visible");
        return `Verified ${targetId} is visible`;
    }

    public static async verifyText(control: BaseControl, actualData: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        const text = await control.getText();
        if (!text.includes(actualData)) {
            throw new Error(`Text mismatch. Expected: ${actualData}, Actual: ${text}`);
        }
        return `Verified text for ${targetId}`;
    }
}
