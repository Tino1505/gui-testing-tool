export class DataResolver {
    public static resolveData(dataVal: string | any, currentDataRow: any): string {
        if (!dataVal) return "";

        let dataValStr = String(dataVal).trim();
        let resolvedValue = dataValStr;

        if (dataValStr.startsWith('$')) {
            const parts = dataValStr.substring(1).split('.');
            if (parts.length === 2) {
                const sheetKey = parts[0].toLowerCase();
                const colKey = parts[1];
                if (currentDataRow && currentDataRow[sheetKey] && currentDataRow[sheetKey][colKey] !== undefined) {
                    resolvedValue = String(currentDataRow[sheetKey][colKey]);
                }
            } else {
                const key = parts[0];
                if (currentDataRow && currentDataRow["_flat"] && currentDataRow["_flat"][key] !== undefined) {
                    resolvedValue = String(currentDataRow["_flat"][key]);
                }
            }
        } else {
            if (currentDataRow && currentDataRow["_flat"] && currentDataRow["_flat"][dataVal] !== undefined) {
                resolvedValue = String(currentDataRow["_flat"][dataVal]);
            }
        }

        const lowerVal = resolvedValue.toLowerCase().trim();
        if (lowerVal === "empty" || lowerVal === "n.a" || resolvedValue === "-") {
            return "";
        }

        return resolvedValue;
    }
}
