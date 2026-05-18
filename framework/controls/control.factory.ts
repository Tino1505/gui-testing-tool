import { BaseControl } from './base/base.control';
import { TextBoxControl } from './input/textbox.control';
import { TextAreaControl } from './input/textarea.control';
import { UploadControl } from './input/upload.control';
import { ButtonControl } from './navigation/button.control';
import { LinkControl } from './navigation/link.control';
import { LabelControl } from './display/label.control';
import { ImageControl } from './display/image.control';
import { DropdownControl } from './selection/dropdown.control';
import { ComboBoxControl } from './selection/combobox.control';
import { CheckBoxControl } from './toggle/checkbox.control';
import { RadioControl } from './selection/radio.control';
import { TableControl } from './table/table.control';

export class ControlFactory {
    public static getControl(elementId: string, locatorType: string, locatorValue: string): BaseControl {
        if (!elementId) return new BaseControl(locatorType, locatorValue);

        const id = elementId.toLowerCase();
        
        if (id.startsWith('txt_') || id.startsWith('inp_')) {
            return new TextBoxControl(locatorType, locatorValue);
        } else if (id.startsWith('txta_')) {
            return new TextAreaControl(locatorType, locatorValue);
        } else if (id.startsWith('btn_')) {
            return new ButtonControl(locatorType, locatorValue);
        } else if (id.startsWith('lbl_') || id.startsWith('txtv_')) {
            return new LabelControl(locatorType, locatorValue);
        } else if (id.startsWith('ddl_') || id.startsWith('sel_')) {
            return new DropdownControl(locatorType, locatorValue);
        } else if (id.startsWith('cbo_')) {
            return new ComboBoxControl(locatorType, locatorValue);
        } else if (id.startsWith('chk_') || id.startsWith('cbx_')) {
            return new CheckBoxControl(locatorType, locatorValue);
        } else if (id.startsWith('rdo_') || id.startsWith('rad_')) {
            return new RadioControl(locatorType, locatorValue);
        } else if (id.startsWith('lnk_')) {
            return new LinkControl(locatorType, locatorValue);
        } else if (id.startsWith('img_')) {
            return new ImageControl(locatorType, locatorValue);
        } else if (id.startsWith('tbl_') || id.startsWith('grid_')) {
            return new TableControl(locatorType, locatorValue);
        } else if (id.startsWith('file_') || id.startsWith('up_')) {
            return new UploadControl(locatorType, locatorValue);
        }
        
        return new BaseControl(locatorType, locatorValue);
    }
}
