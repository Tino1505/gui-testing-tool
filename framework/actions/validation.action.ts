import { BaseControl } from '../controls/base.control';

export class ValidationAction {
    public static async checkStatus(control: BaseControl, targetId: string, actualData: string, expectedValue: string): Promise<string> {
        const expected = expectedValue.toLowerCase();

        if (expected === "visible") return await this.verifyVisible(control, targetId);
        if (expected === "hidden") return await this.verifyHidden(control, targetId);
        if (expected === "exists") return await this.verifyExists(control, targetId);
        if (expected === "not_exists") return await this.verifyNotExists(control, targetId);
        if (expected === "enabled") return await this.verifyEnabled(control, targetId);
        if (expected === "disabled") return await this.verifyDisabled(control, targetId);

        const textToVerify = expectedValue || actualData;
        return await this.verifyText(control, textToVerify, targetId);
    }

    public static async verifyVisible(control: BaseControl, targetId: string): Promise<string> {
        try {
            await control.waitForVisible();
            return `Verified ${targetId} is visible`;
        } catch (e) {
            throw new Error(`Element ${targetId} not visible within timeout`);
        }
    }

    public static async verifyHidden(control: BaseControl, targetId: string): Promise<string> {
        try {
            await control.waitForHidden();
            return `Verified ${targetId} is hidden`;
        } catch (e) {
            throw new Error(`Element ${targetId} is visible but expected hidden`);
        }
    }

    public static async verifyExists(control: BaseControl, targetId: string): Promise<string> {
        const count = await control.getLocator().count();
        if (count === 0) throw new Error("Element does not exist in DOM");
        return `Verified ${targetId} exists`;
    }

    public static async verifyNotExists(control: BaseControl, targetId: string): Promise<string> {
        const count = await control.getLocator().count();
        if (count > 0) throw new Error("Element exists in DOM but expected to not exist");
        return `Verified ${targetId} does not exist`;
    }

    public static async verifyEnabled(control: BaseControl, targetId: string): Promise<string> {
        try {
            await control.waitForVisible();
            const isEnabled = await (control as any).getInteractableLocator().isEnabled();
            if (!isEnabled) throw new Error(`Element ${targetId} is disabled but expected to be enabled`);
            return `Verified ${targetId} is enabled`;
        } catch (e: any) {
            throw new Error(`Element ${targetId} is not enabled: ${e.message}`);
        }
    }
 
    public static async verifyDisabled(control: BaseControl, targetId: string): Promise<string> {
        try {
            await control.waitForVisible();
            const isDisabled = await (control as any).getInteractableLocator().isDisabled();
            if (!isDisabled) throw new Error(`Element ${targetId} is enabled but expected to be disabled`);
            return `Verified ${targetId} is disabled`;
        } catch (e: any) {
            throw new Error(`Element ${targetId} is not disabled: ${e.message}`);
        }
    }

    public static async verifyText(control: BaseControl, actualData: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        const text = await control.getText();
        if (!text.includes(actualData)) {
            throw new Error(`Text mismatch. Expected: ${actualData}, Actual: ${text}`);
        }
        return `Verified text for ${targetId}`;
    }

    public static async verifyValue(control: any, expectedValue: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        const value = await control.getInteractableLocator().inputValue();
        if (value !== expectedValue) {
            throw new Error(`Value mismatch. Expected: ${expectedValue}, Actual: ${value}`);
        }
        return `Verified value for ${targetId}`;
    }
 
    public static async verifyChecked(control: any, expectedState: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        const isChecked = await control.getInteractableLocator().isChecked();
        const shouldBeChecked = String(expectedState).toLowerCase() === 'true' || String(expectedState) === '1' || String(expectedState).toLowerCase() === 'checked';
        if (isChecked !== shouldBeChecked) {
            throw new Error(`Checked state mismatch. Expected: ${shouldBeChecked}, Actual: ${isChecked}`);
        }
        return `Verified checked state for ${targetId}`;
    }
}
