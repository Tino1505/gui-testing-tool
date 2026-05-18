import { BaseControl } from '../base/base.control';

export class ImageControl extends BaseControl {
    public async getSrc(): Promise<string | null> {
        return await this.getAttribute('src');
    }
    
    public async getAlt(): Promise<string | null> {
        return await this.getAttribute('alt');
    }
}
