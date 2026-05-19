import { DataResolver } from '../core/utils/data.resolver';
import { ControlFactory } from '../controls/control.factory';
import { BrowserAction } from './browser.action';
import { InteractionAction } from './interaction.action';
import { ValidationAction } from './validation.action';

export class ActionDispatcher {
    public static async executeStep(step: any, currentDataRow: any, elementsDict: any, pagesDict: any): Promise<string> {
        let action: string = String(step.Action || step.actions || step.action || "").toLowerCase().trim();
        const targetId: string = String(step.TargetElement || step.target || "");
        const dataKey: string = String(step.DataColumn || step.TestDataKey || step.data || step.value || "");
        const expectedKey: string = String(step.Expected || step.expected || "");
        
        const actualData: string = DataResolver.resolveData(dataKey, currentDataRow);
        const expectedValue: string = DataResolver.resolveData(expectedKey, currentDataRow).toLowerCase().trim();

        // Normalize type/enter to input
        if (action === "type" || action === "enter") {
            action = "input";
        }
        
        if (["navigate", "refresh", "switch_tab", "go_back", "go_forward", "capture_screen", "screenshot"].includes(action)) {
            if (action === "navigate") return await BrowserAction.navigate(targetId, pagesDict);
            if (action === "refresh") return await BrowserAction.refresh();
            if (action === "switch_tab") return await BrowserAction.switchTab();
            if (action === "go_back") return await BrowserAction.goBack();
            if (action === "go_forward") return await BrowserAction.goForward();
            if (action === "capture_screen" || action === "screenshot") return await BrowserAction.captureScreen(targetId || "manual_capture");
        }

        if (action === "log") {
            console.log(`[LOG] ${actualData}`);
            return `Log: ${actualData}`;
        }
        if (action === "skip") {
            return `Skipped: ${actualData}`;
        }
        if (action === "fail") {
            throw new Error(`Forced Failure: ${actualData}`);
        }

        if (action === "wait") {
            const ms = Number(actualData) || 2000;
            await new Promise(resolve => setTimeout(resolve, ms));
            return `Waited for ${ms}ms`;
        }

        const elementInfo: any = targetId && targetId !== '-' ? elementsDict[targetId] : null;
        if (!elementInfo) {
            throw new Error(`TargetElement is required for action '${action}'`);
        }
        
        const locatorType = elementInfo.locator_type || "";
        let locatorValue = elementInfo.locator || "";
        
        // Dynamic Locator interpolation
        if (locatorValue.includes('${data}')) {
            locatorValue = locatorValue.replace(/\$\{data\}/g, actualData);
        }
        
        const control = ControlFactory.getControl(targetId, locatorType, locatorValue);
        
        if (["click", "double_click", "right_click", "input", "clear", "focus", "blur", "hover", "select", "select_by_text", "select_by_value", "check", "uncheck", "upload_file", "upload", "scroll_to", "scroll_by", "press_key", "drag_drop"].includes(action)) {
            
            if (action === "click") return await InteractionAction.click(control, targetId);
            if (action === "double_click") return await InteractionAction.doubleClick(control, targetId);
            if (action === "right_click") return await InteractionAction.rightClick(control, targetId);
            if (action === "input") return await InteractionAction.input(control, actualData, targetId);
            if (action === "clear") return await InteractionAction.clear(control, targetId);
            if (action === "focus") return await InteractionAction.focus(control, targetId);
            if (action === "blur") return await InteractionAction.blur(control, targetId);
            if (action === "hover") return await InteractionAction.hover(control, targetId);
            
            if (action === "select" || action === "select_by_text") return await InteractionAction.select(control, actualData, targetId);
            if (action === "select_by_value") return await InteractionAction.selectByValue(control, actualData, targetId);
            
            if (action === "check") return await InteractionAction.check(control, targetId);
            if (action === "uncheck") return await InteractionAction.uncheck(control, targetId);
            if (action === "upload_file" || action === "upload") return await InteractionAction.uploadFile(control, actualData, targetId);
            
            if (action === "scroll_to") return await InteractionAction.scrollTo(control, targetId);
            if (action === "scroll_by") return await InteractionAction.scrollBy(control, targetId, actualData);
            if (action === "press_key") return await InteractionAction.pressKey(control, actualData, targetId);
            
            if (action === "drag_drop") {
                const destInfo = elementsDict[actualData];
                if (!destInfo) throw new Error(`Destination element '${actualData}' not found for drag_drop`);
                const destControl = ControlFactory.getControl(actualData, destInfo.locator_type, destInfo.locator);
                return await InteractionAction.dragDrop(control, destControl, targetId, actualData);
            }
        }

        if (["verify_visible", "verify_hidden", "verify_exists", "verify_not_exists", "verify_text", "verify_value", "verify_checked", "check_status"].includes(action)) {
            
            if (action === "check_status") return await ValidationAction.checkStatus(control, targetId, actualData, expectedValue);

            if (action === "verify_visible") return await ValidationAction.verifyVisible(control, targetId);
            if (action === "verify_hidden") return await ValidationAction.verifyHidden(control, targetId);
            if (action === "verify_exists") return await ValidationAction.verifyExists(control, targetId);
            if (action === "verify_not_exists") return await ValidationAction.verifyNotExists(control, targetId);
            if (action === "verify_text") return await ValidationAction.verifyText(control, actualData, targetId);
            if (action === "verify_value") return await ValidationAction.verifyValue(control, actualData, targetId);
            if (action === "verify_checked") return await ValidationAction.verifyChecked(control, actualData, targetId);
        }

        throw new Error(`Action '${action}' is not supported or not implemented yet.`);
    }
}
