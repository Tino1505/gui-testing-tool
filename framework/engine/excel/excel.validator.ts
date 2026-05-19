export class ExcelValidator {
    // Dictionary of all supported actions
    private static readonly VALID_ACTIONS: { [key: string]: { requiresTarget: boolean, requiresData: boolean, allowedPrefixes: string[] } } = {
        // 0. Browser / Built-in
        'navigate': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] }, // Target is page ID
        'refresh': { requiresTarget: false, requiresData: false, allowedPrefixes: ['*'] },
        'switch_tab': { requiresTarget: false, requiresData: true, allowedPrefixes: ['*'] },
        'wait': { requiresTarget: false, requiresData: true, allowedPrefixes: ['*'] },

        // 1. Interaction
        'click': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'input': { requiresTarget: true, requiresData: true, allowedPrefixes: ['txt_', 'inp_'] },
        'clear': { requiresTarget: true, requiresData: false, allowedPrefixes: ['txt_', 'inp_'] },
        'hover': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'drag_drop': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'upload': { requiresTarget: true, requiresData: true, allowedPrefixes: ['file_', 'up_'] },
        'press_key': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },

        // 2. Validation - Functional
        'verify_visible': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'verify_hidden': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'verify_text': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'verify_value': { requiresTarget: true, requiresData: true, allowedPrefixes: ['txt_', 'inp_', 'ddl_', 'rdo_', 'chk_'] },
        'verify_enabled': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'verify_disabled': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },

        // 3. Validation - UI/UX
        'verify_css': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'verify_attribute': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'verify_class': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'verify_style_contains': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },

        // 4. State / Context
        'store_text': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'store_value': { requiresTarget: true, requiresData: true, allowedPrefixes: ['txt_', 'inp_', 'ddl_'] },
        'use_runtime': { requiresTarget: true, requiresData: true, allowedPrefixes: ['txt_', 'inp_'] },
        'wait_api_response': { requiresTarget: false, requiresData: true, allowedPrefixes: ['*'] }
    };

    public static validate(data: any): string[] {
        const errors: string[] = [];
        const testCases = data.test_cases || [];

        testCases.forEach((tc: any) => {
            if (!tc.steps || !Array.isArray(tc.steps)) return;

            tc.steps.forEach((step: any) => {
                const action = String(step.Action || step.action || "").toLowerCase().trim();
                const target = String(step.TargetElement || step.target || "");
                const dataVal = String(step.DataColumn || step.data || step.TestDataKey || "");
                const stepNo = step.StepNo || step.step;

                // 1. Check if Action is valid
                if (!this.VALID_ACTIONS[action]) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${stepNo}] Invalid Action: '${action}'`);
                    return; // Skip further checks for this invalid step
                }

                const rule = this.VALID_ACTIONS[action];

                // 2. Check Required Target
                if (rule.requiresTarget && !target && target !== '-') {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${stepNo}] Action '${action}' requires a TargetElement`);
                }

                // 3. Check Required Data/Expect
                if (rule.requiresData && !dataVal) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${stepNo}] Action '${action}' requires Data/Expect value`);
                }

                // 4. Check if Action supports Control (Prefix validation)
                if (rule.requiresTarget && target && target !== '-') {
                    let targetPrefix = '*';
                    if (target.includes('_')) {
                        targetPrefix = target.split('_')[0] + "_";
                    }

                    if (!rule.allowedPrefixes.includes('*') && !rule.allowedPrefixes.includes(targetPrefix)) {
                        errors.push(`[TC: ${tc.tc_id} - Step: ${stepNo}] Action '${action}' is not supported for control prefix '${targetPrefix}'`);
                    }
                }

                // 5. Special Type/Format Validations
                if (action === 'wait' && isNaN(Number(dataVal))) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${stepNo}] Action 'wait' expects a numeric duration, got '${dataVal}'`);
                }
                if ((action === 'verify_css' || action === 'verify_attribute') && dataVal && !dataVal.includes(':')) {
                    errors.push(`[TC: ${tc.tc_id} - Step: ${stepNo}] Action '${action}' expects Data in format 'key:value', got '${dataVal}'`);
                }
            });
        });

        return errors;
    }
}
