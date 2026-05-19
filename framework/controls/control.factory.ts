import { BaseControl } from './base.control';
import { TextBoxControl } from './input.control';
import { CheckboxControl } from './checkbox.control';
import { DropdownControl } from './dropdown.control';

export class ControlFactory {
    public static getControl(elementId: string, locatorType: string, locatorValue: string): BaseControl {
        if (!elementId) return new BaseControl(locatorType, locatorValue);

        const id = elementId.toLowerCase();

        if (id.startsWith('txt_') || id.startsWith('inp_')) {
            return new TextBoxControl(locatorType, locatorValue);
        } else if (id.startsWith('chk_') || id.startsWith('cb_') || id.startsWith('rdo_') || id.startsWith('radio_')) {
            return new CheckboxControl(locatorType, locatorValue);
        } else if (id.startsWith('ddl_') || id.startsWith('cbo_') || id.startsWith('select_') || id.startsWith('dropdown_')) {
            return new DropdownControl(locatorType, locatorValue);
        }

        return new BaseControl(locatorType, locatorValue);
    }
}
