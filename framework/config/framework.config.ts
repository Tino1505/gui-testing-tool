import * as path from 'path';

export const FrameworkConfig = {
    // Timeout Configuration (ms)
    TIMEOUT: {
        EXPLICIT: 10000,
        IMPLICIT: 5000,
        PAGE_LOAD: 30000
    },
    
    // Path Configuration
    PATHS: {
        TEST_DATA: path.join(process.cwd(), 'test-data', 'Master_Test_Suite.xlsx'),
        REPORT_DIR: path.join(process.cwd(), 'reports')
    },

    // Browser Configuration
    BROWSER: {
        HEADLESS: false, // Default to visible for GUI testing
        VIEWPORT: { width: 1280, height: 720 }
    },

    // Custom validations (Data integrity rules mapped dynamically)
    CUSTOM_VALIDATIONS: {}
};
