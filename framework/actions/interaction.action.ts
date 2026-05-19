import { BaseControl } from '../controls/base.control';

export class InteractionAction {
    public static async click(control: BaseControl, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.click();
        return `Clicked on ${targetId}`;
    }

    public static async doubleClick(control: BaseControl, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.doubleClick();
        return `Double-clicked on ${targetId}`;
    }

    public static async rightClick(control: BaseControl, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.rightClick();
        return `Right-clicked on ${targetId}`;
    }

    public static async input(control: any, data: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        if (typeof control.clear === 'function' && typeof control.fill === 'function') {
            await control.clear();
            await control.fill(data);
        } else {
            await control.click();
            await control.getLocator().fill(data);
        }
        return `Input: '${data}' into ${targetId}`;
    }

    public static async clear(control: BaseControl, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.clear();
        return `Cleared text in ${targetId}`;
    }

    public static async focus(control: BaseControl, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.focus();
        return `Focused on ${targetId}`;
    }

    public static async blur(control: BaseControl, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().blur();
        return `Blurred ${targetId}`;
    }

    public static async hover(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().hover();
        return `Hovered on ${targetId}`;
    }

    public static async select(control: any, data: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().selectOption({ label: data });
        return `Selected '${data}' in ${targetId}`;
    }

    public static async selectByValue(control: any, data: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().selectOption({ value: data });
        return `Selected value '${data}' in ${targetId}`;
    }

    public static async check(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().check();
        return `Checked ${targetId}`;
    }

    public static async uncheck(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().uncheck();
        return `Unchecked ${targetId}`;
    }

    public static async uploadFile(control: any, filePath: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().setInputFiles(filePath);
        return `Uploaded file to ${targetId}`;
    }

    public static async dragDrop(control: BaseControl, destinationControl: BaseControl, targetId: string, destinationId: string): Promise<string> {
        await control.waitForVisible();
        await destinationControl.waitForVisible();
        await control.dragTo(destinationControl.getLocator());
        return `Dragged ${targetId} to ${destinationId}`;
    }

    public static async scrollTo(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().scrollIntoViewIfNeeded();
        return `Scrolled to ${targetId}`;
    }

    public static async scrollBy(control: any, targetId: string, data: string): Promise<string> {
        const coords = String(data).split(',').map(s => parseInt(s.trim(), 10));
        const x = coords[0] || 0;
        const y = coords[1] || 0;
        await control.getLocator().evaluate((el: HTMLElement, args: {x: number, y: number}) => { el.scrollBy(args.x, args.y); }, {x, y});
        return `Scrolled by (${x}, ${y}) on ${targetId}`;
    }

    public static async pressKey(control: any, key: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getLocator().press(key);
        return `Pressed key '${key}' on ${targetId}`;
    }
}
