import { BaseControl } from '../base/base.control';

export class TooltipControl extends BaseControl {
    public async hoverToShow() {
        await this.getLocator().hover();
    }
}
