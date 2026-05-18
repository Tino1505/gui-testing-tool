import { DataResolver } from '../utils/data.resolver';
import { ControlFactory } from '../controls/control.factory';
import { BrowserAction } from './browser.action';
import { InteractionAction } from './interaction.action';
import { ValidationAction } from './validation.action';
export class ActionDispatcher {
    public static async executeStep(step: any, currentDataRow: any, elementsDict: any, pagesDict: any): Promise<string> {
        const action: string = String(step.Action || step.action || "").toLowerCase().trim();
        const targetId: string = String(step.TargetElement || step.target || "");
        const dataKey: string = String(step.DataColumn || step.TestDataKey || step.data || "");
        
        const actualData: string = DataResolver.resolveData(dataKey, currentDataRow);
        
        if (["navigate", "refresh", "switch_tab"].includes(action)) {
            if (action === "navigate") return await BrowserAction.navigate(targetId, pagesDict);
            if (action === "refresh") return await BrowserAction.refresh();
            if (action === "switch_tab") return await BrowserAction.switchTab();
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
        const locatorValue = elementInfo.locator || "";
        const control = ControlFactory.getControl(targetId, locatorType, locatorValue);
        
        if (["click", "input", "hover", "type"].includes(action)) {
            if (action === "click") return await InteractionAction.click(control, targetId);
            if (action === "input" || action === "type") return await InteractionAction.input(control, actualData, targetId);
            if (action === "hover") return await InteractionAction.hover(control, targetId);
        }

        if (["verify_visible", "verify_text"].includes(action)) {
            if (action === "verify_visible") return await ValidationAction.verifyVisible(control, targetId);
            if (action === "verify_text") return await ValidationAction.verifyText(control, actualData, targetId);
        }

        throw new Error(`Action '${action}' is not supported or not implemented yet.`);
    }
}
