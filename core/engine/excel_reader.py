import openpyxl

def read_test_data(file_path):
    """
    Read test data from an Excel file containing sheets:
    LOCATOR, PAGE, TEST_CASE, TEST_DATA, ACTION
    Returns a dictionary with all the parsed data.
    """
    data = {
        "elements": {},
        "pages": {},
        "scenarios": [],
        "test_data": {}
    }
    
    try:
        workbook = openpyxl.load_workbook(file_path, data_only=True)
        
        # 1. Read LOCATOR (previously ELEMENTS)
        if "LOCATOR" in workbook.sheetnames:
            sheet = workbook["LOCATOR"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue
                row_data = dict(zip(headers, row))
                element_id = row_data.get("element_id")
                if element_id:
                    # map locator_value to locator for backwards compatibility in runner
                    row_data["locator"] = row_data.get("locator_value")
                    data["elements"][element_id] = row_data
                    
        # 2. Read PAGE (previously PAGES)
        if "PAGE" in workbook.sheetnames:
            sheet = workbook["PAGE"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue
                row_data = dict(zip(headers, row))
                page_id = row_data.get("page_id")
                if page_id:
                    data["pages"][page_id] = row_data
                    
        # 3. Read TEST_CASE (previously TEST_SCENARIOS)
        if "TEST_CASE" in workbook.sheetnames:
            sheet = workbook["TEST_CASE"]
            headers = [cell.value for cell in sheet[1]]
            current_tc = None
            current_title = None
            for row in sheet.iter_rows(min_row=2, values_only=True):
                row_data = dict(zip(headers, row))
                tc_id = row_data.get("tc_id")
                
                # Fill down tc_id and title
                if tc_id:
                    current_tc = tc_id
                    current_title = row_data.get("title") or current_title
                else:
                    row_data["tc_id"] = current_tc
                    row_data["title"] = current_title
                    
                if not current_tc: continue
                
                # Skip if step has no action or target (empty row)
                if not row_data.get("action") and not row_data.get("target"):
                    continue
                
                # Auto-correct user data errors on the fly based on review
                if row_data.get("action") == "navigate" and row_data.get("target") == "login_page":
                    row_data["target"] = "login"
                if row_data.get("action") == "check" and row_data.get("target") == "lbl_success":
                    row_data["target"] = "msg_success"
                if row_data.get("action") == "check" and row_data.get("target") == "lbl_error":
                    row_data["target"] = "msg_error"
                
                data["scenarios"].append(row_data)

        # Group scenarios into test cases
        grouped_scenarios = {}
        for step in data["scenarios"]:
            tc_id = step["tc_id"]
            if tc_id not in grouped_scenarios:
                grouped_scenarios[tc_id] = {
                    "tc_id": tc_id,
                    "summary": step.get("title", ""), # map title to summary
                    "run": True, # Always run since run column was removed
                    "steps": []
                }
            grouped_scenarios[tc_id]["steps"].append(step)
            
        data["test_cases"] = list(grouped_scenarios.values())

        # 4. Read TEST_DATA
        if "TEST_DATA" in workbook.sheetnames:
            sheet = workbook["TEST_DATA"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue
                row_data = dict(zip(headers, row))
                data_key = row_data.get("data_key")
                if data_key:
                    data["test_data"][data_key] = row_data.get("value")

        return data
    except Exception as e:
        print(f"[Error] Failed to read Excel file '{file_path}': {e}")
        return data
