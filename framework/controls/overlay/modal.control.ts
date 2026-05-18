import { BaseControl } from '../base/base.control';

export class ModalControl extends BaseControl {
    public async close() {
        await this.getLocator().locator('.close-btn, .btn-close').click();
    }
}
