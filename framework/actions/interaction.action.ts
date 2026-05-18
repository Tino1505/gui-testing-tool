import { BaseControl } from '../controls/base.control';

export class InteractionAction {
    public static async click(control: BaseControl, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.click();
        return `Clicked on ${targetId}`;
    }

    public static async input(control: any, data: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        if (typeof control.clear === 'function' && typeof control.fill === 'function') {
            await control.clear();
            await control.fill(data);
        } else {
            // fallback
            await control.click();
            await (control as any).getLocator().fill(data);
        }
        return `Input: '${data}' into ${targetId}`;
    }

    public static async hover(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().hover();
        return `Hovered on ${targetId}`;
    }
}
