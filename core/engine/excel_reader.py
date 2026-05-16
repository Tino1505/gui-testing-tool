import openpyxl

def read_test_data(file_path):
    """
    Read test data from an Excel file containing sheets:
    TEST_CASE, PAGE, ELEMENT, DATA
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
        
        # 1. Read ELEMENT
        if "ELEMENT" in workbook.sheetnames:
            sheet = workbook["ELEMENT"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue
                row_data = dict(zip(headers, row))
                element_key = row_data.get("ElementKey")
                locator_type = row_data.get("LocatorType")
                locator_value = row_data.get("LocatorValue")
                if element_key:
                    data["elements"][element_key] = {
                        "locator": locator_value,
                        "locator_type": locator_type
                    }

        # 2. Read PAGE
        if "PAGE" in workbook.sheetnames:
            sheet = workbook["PAGE"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue
                row_data = dict(zip(headers, row))
                page_key = row_data.get("PageKey")
                url = row_data.get("URL")
                page_name = row_data.get("Page Name", page_key)
                if page_key:
                    data["pages"][page_key] = {"url": url, "name": page_name}

        # 3. Read DATA
        if "DATA" in workbook.sheetnames:
            sheet = workbook["DATA"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                if not row[0]: continue # DataSet is empty
                row_data = dict(zip(headers, row))
                dataset = row_data.get("DataType") or row_data.get("DataSet")
                if dataset:
                    if dataset not in data["test_data"]:
                        data["test_data"][dataset] = []
                    data["test_data"][dataset].append(row_data)

        # 4. Read TEST_CASE
        grouped_scenarios = {}
        current_tc_id = None
        current_dataset = None
        
        if "TEST_CASE" in workbook.sheetnames:
            sheet = workbook["TEST_CASE"]
            headers = [cell.value for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                # if row is completely empty, skip
                if not any(row):
                    continue
                    
                row_data = dict(zip(headers, row))
                
                # Check if it's a new TC
                tc_id = row_data.get("TC_ID")
                if tc_id and str(tc_id).strip():
                    current_tc_id = str(tc_id).strip()
                    dataset_val = row_data.get("Data") or row_data.get("DataType") or row_data.get("DataSet")
                    if dataset_val and str(dataset_val).strip():
                        current_dataset = str(dataset_val).strip()
                    else:
                        current_dataset = None
                    
                    if current_tc_id not in grouped_scenarios:
                        grouped_scenarios[current_tc_id] = {
                            "tc_id": current_tc_id,
                            "summary": row_data.get("Summary", ""),
                            "run": True,
                            "dataset": current_dataset,
                            "steps": []
                        }
                        
                if current_tc_id:
                    # check if this row has a step
                    step_no = row_data.get("Step")
                    if step_no and str(step_no).strip():
                        # Add step to the current TC
                        # Notice we map headers from the image to standard internal keys
                        step_data = {
                            "TestCaseID": current_tc_id,
                            "StepNo": step_no,
                            "Action": row_data.get("Action"),
                            "TargetElement": row_data.get("Target"),
                            "DataColumn": row_data.get("Data")
                        }
                        grouped_scenarios[current_tc_id]["steps"].append(step_data)
                        
        data["test_cases"] = list(grouped_scenarios.values())

        return data
    except Exception as e:
        print(f"[Error] Failed to read Excel file '{file_path}': {e}")
        return data
