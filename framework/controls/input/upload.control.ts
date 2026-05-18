import { BaseControl } from '../base/base.control';

export class UploadControl extends BaseControl {
    public async uploadFiles(files: string | string[]) {
        await this.setInputFiles(files);
    }

    public async executeAction(action: string, actualData: string, step: any, targetId: string): Promise<string> {
        if (action === "upload") {
            if (!actualData) throw new Error(`File paths missing for upload action.`);
            const filesArray = actualData.split(',').map(f => f.trim());
            await this.uploadFiles(filesArray);
            return `Uploaded file(s) to ${targetId}`;
        }
        
        return super.executeAction(action, actualData, step, targetId);
    }
}
