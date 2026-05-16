from selenium import webdriver
from selenium.webdriver.chrome.options import Options

class BrowserManager:
    def __init__(self):
        self.driver = None

    def start(self, headless=False):
        chrome_options = Options()
        if headless:
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--window-size=1920,1080")
        
        chrome_options.add_argument("--start-maximized")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        try:
            self.driver.maximize_window()
        except:
            pass # ignore if already maximized or in headless
        self.driver.implicitly_wait(10)
        return self.driver

    def stop(self):
        if self.driver:
            self.driver.quit()
            self.driver = None
