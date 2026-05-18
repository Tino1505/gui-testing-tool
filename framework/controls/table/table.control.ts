import { BaseControl } from '../base/base.control';

export class TableControl extends BaseControl {
    public async getRowCount(): Promise<number> {
        return await this.getLocator().locator('tbody tr').count();
    }

    public async getCellText(row: number, col: number): Promise<string> {
        return await this.getLocator().locator(`tbody tr:nth-child(${row}) td:nth-child(${col})`).innerText();
    }
}
