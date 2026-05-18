import { BaseControl } from '../base/base.control';

export class PaginationControl extends BaseControl {
    public async goToNextPage() {
        await this.getLocator().locator('.next-btn, [aria-label="Next"]').click();
    }
}
