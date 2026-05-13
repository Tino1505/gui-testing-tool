import os
import sys

# Add current directory to python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from engine.runner import run_tests

if __name__ == "__main__":
    # Assuming run.py is in qc-demo/core/
    # test data is in qc-demo/test-data/
    current_dir = os.path.dirname(os.path.abspath(__file__))
    excel_path = os.path.join(current_dir, "..", "test-data", "demo_test_data.xlsx")
    excel_path = os.path.abspath(excel_path)
    
    print("Starting GUI Testing Tool...")
    run_tests(excel_path)
