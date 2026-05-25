import { FrameworkConfig } from '../../../config/framework.config';

export class ExcelValidator {
    // Dictionary of all supported actions
    private static readonly VALID_ACTIONS: { [key: string]: { requiresTarget: boolean, requiresData: boolean, allowedPrefixes: string[] } } = {
        // 0. Browser / Built-in
        'navigate': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] }, // Target is page ID
        'refresh': { requiresTarget: false, requiresData: false, allowedPrefixes: ['*'] },
        'refresh precondition': { requiresTarget: false, requiresData: false, allowedPrefixes: ['*'] },
        'refresh_precondition': { requiresTarget: false, requiresData: false, allowedPrefixes: ['*'] },
        'switch_tab': { requiresTarget: false, requiresData: true, allowedPrefixes: ['*'] },
        'wait': { requiresTarget: false, requiresData: true, allowedPrefixes: ['*'] },
        'capture_screen': { requiresTarget: false, requiresData: false, allowedPrefixes: ['*'] },
        'call_tc': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] }, // Reusable test case
        'run_tc': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] }, // Reusable test case (alias)

        // 1. Interaction
        'click': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'double_click': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'right_click': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'input': { requiresTarget: true, requiresData: true, allowedPrefixes: ['txt_', 'inp_'] },
        'clear': { requiresTarget: true, requiresData: false, allowedPrefixes: ['txt_', 'inp_'] },
        'focus': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'blur': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'hover': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'drag_drop': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'upload': { requiresTarget: true, requiresData: true, allowedPrefixes: ['file_', 'up_'] },
        'upload_file': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'press_key': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'select_by_text': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'select_by_value': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },
        'check': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'uncheck': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'scroll_to': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },
        'scroll_by': { requiresTarget: true, requiresData: true, allowedPrefixes: ['*'] },

        // 2. Validation - Functional
        'check_status': { requiresTarget: true, requiresData: false, allowedPrefixes: ['*'] },

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
        const validHospitals: string[] = data.valid_hospitals || [];

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
                // Run generic custom validation rules if defined in config
                const customRules = FrameworkConfig.CUSTOM_VALIDATIONS || {};
                const ruleConfig = customRules[target];
                if (ruleConfig && ruleConfig.type === 'lookup' && dataVal) {
                    if (!dataVal.startsWith('$')) {
                        const allowedValues = data.custom_lookups?.[target] || [];
                        if (!allowedValues.includes(dataVal.trim())) {
                            errors.push(
                                `[TC: ${tc.tc_id} - Step: ${stepNo}] Giá trị '${dataVal}' không hợp lệ cho '${target}'!\n` +
                                `    - Danh sách giá trị hợp lệ trong cấu hình Excel:\n` +
                                allowedValues.map((v: any) => `      + ${v}`).join('\n')
                            );
                        }
                    }
                }
            });
        });

        return errors;
    }
}
