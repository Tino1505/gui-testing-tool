import { BaseControl } from '../base/base.control';

export class CheckBoxControl extends BaseControl {
    public async check() {
        await this.getLocator().check();
    }

    public async uncheck() {
        await this.getLocator().uncheck();
    }

    public async isChecked(): Promise<boolean> {
        return await this.getLocator().isChecked();
    }

    public async executeAction(action: string, actualData: string, step: any, targetId: string): Promise<string> {
        if (action === "check") {
            await this.waitForVisible();
            await this.check();
            return `Checked ${targetId}`;
        }
        if (action === "uncheck") {
            await this.waitForVisible();
            await this.uncheck();
            return `Unchecked ${targetId}`;
        }
        
        return super.executeAction(action, actualData, step, targetId);
    }
}
