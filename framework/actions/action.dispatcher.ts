import { DataResolver } from '../utils/data.resolver';
import { ControlFactory } from '../controls/control.factory';
import { PlaywrightDriver } from '../drivers/playwright.driver';
import { SleepUtil } from '../utils/sleep.util';

export class ActionDispatcher {
    public static async executeStep(step: any, currentDataRow: any, elementsDict: any, pagesDict: any): Promise<string> {
        const action: string = String(step.Action || step.action || "").toLowerCase().trim();
        const targetId: string = String(step.TargetElement || step.target || "");
        const dataKey: string = String(step.DataColumn || step.TestDataKey || step.data || "");
        
        const actualData: string = DataResolver.resolveData(dataKey, currentDataRow);
        
        // Handle navigation specifically as it doesn't target an element
        if (action === "navigate") {
            const page = pagesDict[targetId];
            if (!page) throw new Error(`Page ID '${targetId}' not found in OBJECT_REPOSITORY.`);
            
            const url = page.url;
            const pageName = page.name || targetId;
            
            if (!url) {
                return `Navigated: ${pageName} (No static URL)`;
            } else {
                await PlaywrightDriver.navigate(url);
                await SleepUtil.sleep(2000);
                return `Navigated: ${pageName}`;
            }
        }
        
        const elementInfo: any = targetId && targetId !== '-' ? elementsDict[targetId] : null;

        // For all other actions, we delegate to the appropriate Control class
        if (!elementInfo && action !== "wait") {
            throw new Error(`TargetElement is required for action '${action}'`);
        }
        
        const locatorType = elementInfo ? elementInfo.locator_type : "";
        const locatorValue = elementInfo ? elementInfo.locator : "";

        const control = ControlFactory.getControl(targetId, locatorType, locatorValue);
        
        return await control.executeAction(action, actualData, step, targetId);
    }
}
