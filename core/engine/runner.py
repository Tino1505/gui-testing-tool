from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
import time

from engine.excel_reader import read_test_data
from engine.browser import BrowserManager
from engine.screenshot import capture_screenshot
from engine.report import generate_report, update_input_excel_with_results

def get_locator_tuple(locator_type, locator_str):
    if locator_type:
        locator_type = str(locator_type).lower().strip()
    else:
        locator_type = ""
        
    if locator_type == 'id':
        return (By.ID, locator_str)
    elif locator_type == 'css':
        return (By.CSS_SELECTOR, locator_str)
    elif locator_type == 'xpath':
        return (By.XPATH, locator_str)
    elif locator_type == 'name':
        return (By.NAME, locator_str)
    elif locator_type == 'class':
        return (By.CLASS_NAME, locator_str)
    elif locator_type == 'tag':
        return (By.TAG_NAME, locator_str)
    else:
        if locator_str.startswith('/') or locator_str.startswith('//'):
            return (By.XPATH, locator_str)
        else:
            return (By.CSS_SELECTOR, locator_str)

def resolve_data(data_val, test_data_dict):
    """
    Resolve data_val using TEST_DATA sheet. If not found, use data_val directly.
    """
    if not data_val or data_val == "-":
        return ""
    # If it's a key in TEST_DATA, return the value, otherwise return the string itself
    return test_data_dict.get(data_val, data_val)

def execute_step(driver, step, test_data_dict, elements_dict, pages_dict):
    action = str(step.get("Action", step.get("action", ""))).lower().strip()
    target_id = step.get("TargetElement", step.get("target"))
    data_key = step.get("TestDataKey", step.get("data"))
    
    actual_data = resolve_data(data_key, test_data_dict)
    
    message = f"Executed {action} on {target_id}"
    
    if action == "navigate":
        # target_id is a page_id here
        page = pages_dict.get(target_id)
        if not page:
            raise Exception(f"Page ID '{target_id}' not found in OBJECT_REPOSITORY as url.")
        url = page.get("url")
        if not url:
             # Try dynamic navigation or just stay if URL is empty (like for product detail)
             message = f"Navigated to {target_id} (No static URL)"
        else:
             driver.get(url)
             time.sleep(2) # Basic wait
             message = f"Navigated to {url}"
             
    elif action == "wait":
        if target_id and target_id != "-":
            element_info = elements_dict.get(target_id)
            if element_info:
                locator_str = element_info.get("locator")
                locator_type = element_info.get("locator_type")
                by_type, by_val = get_locator_tuple(locator_type, locator_str)
                wait = WebDriverWait(driver, 10)
                try:
                    wait.until(EC.presence_of_element_located((by_type, by_val)))
                    message = f"Waited for element {target_id}"
                except:
                    message = f"Wait timeout for element {target_id}"
            else:
                time.sleep(3)
                message = f"Waited for 3 seconds"
        else:
            time.sleep(3)
            message = f"Waited for 3 seconds"
             
    else:
        # All other actions need an element
        element_info = elements_dict.get(target_id)
        if not element_info:
            raise Exception(f"Element ID '{target_id}' not found in OBJECT_REPOSITORY.")
            
        locator_str = element_info.get("locator")
        locator_type = element_info.get("locator_type")
        by_type, by_val = get_locator_tuple(locator_type, locator_str)
        
        # Wait for element
        wait = WebDriverWait(driver, 10)
        
        if action == "input":
            el = wait.until(EC.presence_of_element_located((by_type, by_val)))
            el.clear()
            el.send_keys(actual_data)
            message = f"Input '{actual_data}' into {target_id}"
            
        elif action == "click":
            el = wait.until(EC.element_to_be_clickable((by_type, by_val)))
            el.click()
            message = f"Clicked {target_id}"
            
        elif action == "click_first":
            # wait for at least one
            wait.until(EC.presence_of_element_located((by_type, by_val)))
            elements = driver.find_elements(by_type, by_val)
            if elements:
                elements[0].click()
                message = f"Clicked first {target_id}"
            else:
                raise Exception(f"No elements found for {target_id}")
                
        elif action in ["verify", "verify_text", "check"]:
            el = wait.until(EC.presence_of_element_located((by_type, by_val)))
            actual_text = el.text.strip()
            if not actual_text:
                actual_text = el.get_attribute("value") or ""
            actual_text = actual_text.strip()
            if actual_text == str(actual_data).strip():
                message = f"Verified text matches: '{actual_data}'"
            else:
                raise Exception(f"Text mismatch. Expected '{actual_data}', Got '{actual_text}'")
                
        elif action == "verify_visible":
            el = wait.until(EC.presence_of_element_located((by_type, by_val)))
            if el.is_displayed():
                message = f"Verified {target_id} is visible"
            else:
                raise Exception(f"{target_id} is not visible")
                
        elif action == "select":
            el = wait.until(EC.presence_of_element_located((by_type, by_val)))
            select = Select(el)
            select.select_by_visible_text(str(actual_data))
            message = f"Selected '{actual_data}' from {target_id}"
                
        else:
            raise Exception(f"Unknown action: '{action}'")
            
    return message

def run_tests(excel_path):
    print(f"Reading test data from: {excel_path}")
    data = read_test_data(excel_path)
    test_cases = data.get("test_cases", [])
    
    if not test_cases:
        print("No test cases found or error reading file.")
        return

    browser_manager = BrowserManager()
    driver = browser_manager.start(headless=False)
    
    results = []
    screenshots_dir = "screenshots"
    reports_dir = "reports"
    
    try:
        for tc in test_cases:
            tc_id = tc["tc_id"]
            if not tc.get("run", True):
                print(f"Skipping {tc_id} (run != Y)")
                continue
                
            print(f"--- Running {tc_id}: {tc['summary']} ---")
            
            tc_result = {
                "tc_id": tc_id,
                "summary": tc["summary"],
                "passed": True,
                "steps": [],
                "screenshot": None
            }
            
            tc_start_time = time.time()
            
            for step in tc["steps"]:
                step_start_time = time.time()
                step_no = step.get("StepNo", step.get("step"))
                action = step.get("Action", step.get("action"))
                target = step.get("TargetElement", step.get("target"))
                data_key = step.get("TestDataKey", step.get("data"))
                print(f"  Step {step_no}: {action} {target} {data_key}")
                
                step_result = {
                    "step": step_no,
                    "action": action,
                    "target": target,
                    "data": data_key,
                    "passed": False,
                    "message": ""
                }
                
                try:
                    msg = execute_step(driver, step, data["test_data"], data["elements"], data["pages"])
                    step_result["passed"] = True
                    step_result["message"] = msg
                except Exception as e:
                    step_result["passed"] = False
                    step_result["message"] = f"Error: {str(e)}"
                    tc_result["passed"] = False
                    
                step_end_time = time.time()
                step_result["duration"] = f"{(step_end_time - step_start_time):.2f}s"
                
                tc_result["steps"].append(step_result)
                
                if not step_result["passed"]:
                    break # Stop executing further steps if one fails
            
            tc_end_time = time.time()
            tc_result["duration"] = f"{(tc_end_time - tc_start_time):.2f}s"
            
            # Take screenshot at the end of the test case (or when it fails)
            screenshot_path = capture_screenshot(driver, tc_id, screenshots_dir)
            if screenshot_path:
                tc_result["screenshot"] = screenshot_path
                
            results.append(tc_result)
            
    finally:
        browser_manager.stop()
        
    print("Generating reports...")
    html_report_path = generate_report(results, reports_dir)
    print(f"HTML Report saved to {html_report_path}")
    update_input_excel_with_results(excel_path, results)
    print("Done!")
