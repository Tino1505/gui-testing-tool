import os
import time
from jinja2 import Template

TEMPLATE_STR = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GUI Testing Report (Level 3)</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #2c3e50; }
        .summary { display: flex; justify-content: space-around; background: #ecf0f1; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .summary div { text-align: center; font-size: 1.2em; font-weight: bold; }
        .pass-text { color: #27ae60; }
        .fail-text { color: #c0392b; }
        .tc-card { border: 1px solid #ddd; margin-bottom: 20px; border-radius: 8px; overflow: hidden; }
        .tc-header { background-color: #34495e; color: white; padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; }
        .tc-header h3 { margin: 0; }
        .status-pass { background-color: #27ae60; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.9em; }
        .status-fail { background-color: #c0392b; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 0.9em; }
        .tc-body { padding: 15px; display: flex; gap: 20px; }
        .steps-container { flex: 1; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; font-size: 0.95em; }
        th { background-color: #f9f9f9; color: #555; }
        .screenshot-container { width: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-left: 1px solid #ddd; padding-left: 20px; }
        .screenshot { max-width: 100%; max-height: 200px; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; }
        .screenshot:hover { opacity: 0.8; }
        .modal { display: none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.8); }
        .modal-content { margin: auto; display: block; max-width: 90%; max-height: 90%; margin-top: 2%; }
        .close { position: absolute; top: 15px; right: 35px; color: #f1f1f1; font-size: 40px; font-weight: bold; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>GUI Testing Report</h1>
        
        <div class="summary">
            <div>Total TC: {{ total }}</div>
            <div class="pass-text">Passed: {{ passed }}</div>
            <div class="fail-text">Failed: {{ failed }}</div>
            <div>Time: {{ time }}</div>
        </div>

        {% for tc in results %}
        <div class="tc-card">
            <div class="tc-header">
                <h3>{{ tc.tc_id }}: {{ tc.summary }}</h3>
                {% if tc.passed %}
                    <span class="status-pass">PASS</span>
                {% else %}
                    <span class="status-fail">FAIL</span>
                {% endif %}
            </div>
            <div class="tc-body">
                <div class="steps-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Step</th>
                                <th>Action</th>
                                <th>Target</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for step in tc.steps %}
                            <tr>
                                <td>{{ step.step }}</td>
                                <td><b>{{ step.action }}</b></td>
                                <td><code>{{ step.target }}</code></td>
                                <td>{{ step.data }}</td>
                                <td>
                                    {% if step.passed %}
                                        <span style="color: #27ae60; font-weight: bold;">PASS</span>
                                    {% else %}
                                        <span style="color: #c0392b; font-weight: bold;">FAIL</span>
                                    {% endif %}
                                </td>
                                <td>{{ step.message }}</td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </div>
                <div class="screenshot-container">
                    {% if tc.screenshot %}
                        <p style="margin-top: 0; font-size: 0.9em; color: #777;">Evidence</p>
                        <img class="screenshot" src="../{{ tc.screenshot }}" alt="Screenshot" onclick="openModal(this.src)">
                    {% else %}
                        <p>No Screenshot</p>
                    {% endif %}
                </div>
            </div>
        </div>
        {% endfor %}
    </div>

    <!-- The Modal -->
    <div id="myModal" class="modal">
      <span class="close" onclick="closeModal()">&times;</span>
      <img class="modal-content" id="img01">
    </div>

    <script>
        function openModal(src) {
            document.getElementById("myModal").style.display = "block";
            document.getElementById("img01").src = src;
        }
        function closeModal() {
            document.getElementById("myModal").style.display = "none";
        }
    </script>
</body>
</html>
"""

def generate_report(results, report_dir="reports"):
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)
        
    total = len(results)
    passed = sum(1 for r in results if r.get('passed'))
    failed = total - passed
    current_time = time.strftime("%Y-%m-%d %H:%M:%S")
    
    # Ensure screenshot paths use forward slashes for HTML URLs
    for tc in results:
        if tc.get("screenshot"):
            tc["screenshot"] = tc["screenshot"].replace("\\", "/")

    template = Template(TEMPLATE_STR)
    
    html_content = template.render(
        results=results,
        total=total,
        passed=passed,
        failed=failed,
        time=current_time
    )
    
    from datetime import datetime, timezone, timedelta
    vn_tz = timezone(timedelta(hours=7))
    timestamp_str = datetime.now(vn_tz).strftime("%Y%m%d_%H%M%S")
    
    report_path = os.path.join(report_dir, f"Report_{timestamp_str}.html")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    return report_path

def generate_excel_report(results, report_dir="reports"):
    import openpyxl
    from openpyxl.styles import PatternFill, Font, Alignment
    from openpyxl.drawing.image import Image

    if not os.path.exists(report_dir):
        os.makedirs(report_dir)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Test Results"

    # Define headers
    headers = ["TC ID", "Summary", "Status", "Screenshot"]
    for col_num, header_title in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num, value=header_title)
        cell.font = Font(bold=True)
        cell.fill = PatternFill(start_color="DDDDDD", end_color="DDDDDD", fill_type="solid")
        cell.alignment = Alignment(horizontal="center", vertical="center")

    # Set column widths
    ws.column_dimensions['A'].width = 15
    ws.column_dimensions['B'].width = 50
    ws.column_dimensions['C'].width = 15
    ws.column_dimensions['D'].width = 40

    row_num = 2
    for tc in results:
        ws.cell(row=row_num, column=1, value=tc["tc_id"]).alignment = Alignment(vertical="center")
        ws.cell(row=row_num, column=2, value=tc["summary"]).alignment = Alignment(vertical="center", wrap_text=True)
        
        status_cell = ws.cell(row=row_num, column=3, value="PASS" if tc["passed"] else "FAIL")
        status_cell.alignment = Alignment(horizontal="center", vertical="center")
        if tc["passed"]:
            status_cell.font = Font(color="008000", bold=True)
        else:
            status_cell.font = Font(color="FF0000", bold=True)

        screenshot_path = tc.get("screenshot")
        if screenshot_path and os.path.exists(screenshot_path):
            try:
                img = Image(screenshot_path)
                # Resize image to fit nicely
                img.width = 250
                img.height = 150
                ws.add_image(img, f"D{row_num}")
                ws.row_dimensions[row_num].height = 120
            except Exception as e:
                ws.cell(row=row_num, column=4, value=f"Error loading image: {e}")

        row_num += 1

    from datetime import datetime, timezone, timedelta
    vn_tz = timezone(timedelta(hours=7))
    timestamp_str = datetime.now(vn_tz).strftime("%Y%m%d_%H%M%S")

    report_path = os.path.join(report_dir, f"Report_{timestamp_str}.xlsx")
    wb.save(report_path)
    return report_path
