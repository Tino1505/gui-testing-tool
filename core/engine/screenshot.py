import os
import time

def capture_screenshot(driver, test_case_id, screenshots_dir):
    """
    Capture a screenshot of the current browser window and save it.
    """
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)
        
    timestamp = int(time.time())
    filename = f"{test_case_id}_{timestamp}.png"
    filepath = os.path.join(screenshots_dir, filename)
    
    try:
        driver.save_screenshot(filepath)
        return filepath
    except Exception as e:
        print(f"[Error] Failed to capture screenshot for {test_case_id}: {e}")
        return None
