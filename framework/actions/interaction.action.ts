import { BaseControl } from '../controls/base.control';
import { ValidationAction } from './validation.action';
import { ControlFactory } from '../controls/control.factory';

export class InteractionAction {
    public static async click(control: BaseControl, targetId: string, verifyTargetId?: string, expectedValue?: string, elementsDict?: any): Promise<string> {
        await control.waitForVisible();
        await control.click();
        let resultMsg = `Clicked on ${targetId}`;

        // Nếu file Excel có điền cột Value và Expected -> Gọi check_status
        if (verifyTargetId && verifyTargetId !== '-' && expectedValue && elementsDict) {
            const destInfo = elementsDict[verifyTargetId];
            if (!destInfo) throw new Error(`Verify element '${verifyTargetId}' not found in ELEMENT sheet.`);

            const verifyControl = ControlFactory.getControl(verifyTargetId, destInfo.locator_type, destInfo.locator);
            const verifyMsg = await ValidationAction.checkStatus(verifyControl, verifyTargetId, "", expectedValue);
            resultMsg += ` | Auto-verified: ${verifyMsg}`;
        }
        return resultMsg;
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
        const isDataEmpty = data === undefined || data === null || data === '';
        if (isDataEmpty) {
            const visible = await control.isVisible();
            if (!visible) {
                console.warn(`[Warning] Element '${targetId}' is hidden and the input data is empty. Skipping interaction.`);
                return `Skipped input: '${data}' into hidden ${targetId}`;
            }
        }
        await control.waitForVisible();
        if (typeof control.clear === 'function' && typeof control.fill === 'function') {
            await control.clear();
            await control.fill(data);
        } else {
            await control.click();
            await control.getInteractableLocator().fill(data);
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
        await control.getInteractableLocator().blur();
        return `Blurred ${targetId}`;
    }

    public static async hover(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().hover();
        return `Hovered on ${targetId}`;
    }

    public static async selectByText(control: any, data: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().selectOption({ label: data });
        return `Selected '${data}' in ${targetId}`;
    }

    public static async selectByValue(control: any, data: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().selectOption({ value: data });
        return `Selected value '${data}' in ${targetId}`;
    }

    public static async check(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().check();
        return `Checked ${targetId}`;
    }

    public static async uncheck(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().uncheck();
        return `Unchecked ${targetId}`;
    }

    public static async uploadFile(control: any, filePath: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().setInputFiles(filePath);
        return `Uploaded file to ${targetId}`;
    }

    public static async dragDrop(control: BaseControl, destinationControl: BaseControl, targetId: string, destinationId: string): Promise<string> {
        await control.waitForVisible();
        await destinationControl.waitForVisible();
        await control.dragTo(destinationControl.getInteractableLocator());
        return `Dragged ${targetId} to ${destinationId}`;
    }

    public static async scrollTo(control: any, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().scrollIntoViewIfNeeded();
        return `Scrolled to ${targetId}`;
    }

    public static async scrollBy(control: any, targetId: string, data: string): Promise<string> {
        const coords = String(data).split(',').map(s => parseInt(s.trim(), 10));
        const x = coords[0] || 0;
        const y = coords[1] || 0;
        await control.getInteractableLocator().evaluate((el: HTMLElement, args: { x: number, y: number }) => { el.scrollBy(args.x, args.y); }, { x, y });
        return `Scrolled by (${x}, ${y}) on ${targetId}`;
    }

    public static async pressKey(control: any, key: string, targetId: string): Promise<string> {
        await control.waitForVisible();
        await control.getInteractableLocator().press(key);
        return `Pressed key '${key}' on ${targetId}`;
    }
}
