import { BaseControl } from '../base/base.control';

export class ToastControl extends BaseControl {
    public async waitForToastToDisappear(timeoutMs: number = 5000) {
        await this.waitForHidden(timeoutMs);
    }
}
