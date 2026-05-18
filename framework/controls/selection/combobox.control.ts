import { BaseControl } from '../base/base.control';
import { SleepUtil } from '../../utils/sleep.util';

export class ComboBoxControl extends BaseControl {
    public async selectItem(text: string, inputLocator?: string) {
        // Nhập text vào ô input của combobox
        if (inputLocator) {
            await this.getLocator().locator(inputLocator).fill(text);
        } else {
            await this.getLocator().fill(text);
        }
        
        await SleepUtil.sleep(500); // Chờ popup xuất hiện
        
        // Nhấn phím Enter để chọn kết quả đầu tiên (mặc định)
        await this.getLocator().press('Enter');
    }
}
