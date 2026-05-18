import { BaseControl } from './base.control';
import { TextBoxControl } from './input.control';
import { ButtonControl } from './button.control';
import { LabelControl } from './text.control';

export class ControlFactory {
    public static getControl(elementId: string, locatorType: string, locatorValue: string): BaseControl {
        if (!elementId) return new BaseControl(locatorType, locatorValue);

        const id = elementId.toLowerCase();
        
        if (id.startsWith('txt_') || id.startsWith('inp_')) {
            return new TextBoxControl(locatorType, locatorValue);
        } else if (id.startsWith('btn_')) {
            return new ButtonControl(locatorType, locatorValue);
        } else if (id.startsWith('lbl_') || id.startsWith('txtv_')) {
            return new LabelControl(locatorType, locatorValue);
        }
        
        return new BaseControl(locatorType, locatorValue);
    }
}
