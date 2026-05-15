import openpyxl

def read_test_data(file_path):
    """
    Read test data from an Excel file containing sheets:
    TEST_CASES, TEST_STEPS, TEST_DATA, OBJECT_REPOSITORY
    Returns a dictionary with all the parsed data.
    """
    data = {
        "elements": {},
        "pages": {},
        "scenarios": [],
        "test_cases": [],
        "test_data": {}
    }
    
    try:
        workbook = openpyxl.load_workbook(file_path, data_only=True)
        
        # 1. Read OBJECT_REPOSITORY
        if "OBJECT_REPOSITORY" in workbook.sheetnames:
            sheet = workbook["OBJECT_REPOSITORY"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue
                row_data = dict(zip(headers, row))
                element_key = row_data.get("ElementKey")
                locator_type = row_data.get("LocatorType")
                locator_value = row_data.get("LocatorValue")
                if element_key:
                    if locator_type == 'url':
                        data["pages"][element_key] = {"url": locator_value}
                    else:
                        data["elements"][element_key] = {
                            "locator": locator_value,
                            "locator_type": locator_type
                        }
                    
        # 2. Read TEST_CASES
        test_case_info = {}
        if "TEST_CASES" in workbook.sheetnames:
            sheet = workbook["TEST_CASES"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue
                row_data = dict(zip(headers, row))
                tc_id = row_data.get("TestCaseID")
                if tc_id:
                    test_case_info[tc_id] = row_data

        # 3. Read TEST_STEPS
        if "TEST_STEPS" in workbook.sheetnames:
            sheet = workbook["TEST_STEPS"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                row_data = dict(zip(headers, row))
                tc_id = row_data.get("TestCaseID")
                if not tc_id: continue
                data["scenarios"].append(row_data)

        # Group scenarios into test cases
        grouped_scenarios = {}
        for step in data["scenarios"]:
            tc_id = step["TestCaseID"]
            if tc_id not in grouped_scenarios:
                grouped_scenarios[tc_id] = {
                    "tc_id": tc_id,
                    "summary": test_case_info.get(tc_id, {}).get("Title", f"Test Case {tc_id}"),
                    "run": True,
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
                data_key = row_data.get("DataKey")
                if data_key:
                    data["test_data"][data_key] = row_data.get("Value")

        return data
    except Exception as e:
        print(f"[Error] Failed to read Excel file '{file_path}': {e}")
        return data
