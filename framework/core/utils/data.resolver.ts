export class DataResolver {
    private static safeString(val: any): string {
        if (val === null || val === undefined) return "";
        return String(val);
    }

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
                    resolvedValue = DataResolver.safeString(currentDataRow[sheetKey][colKey]);
                } else if (currentDataRow) {
                    // Generic fuzzy sheet matching to avoid project-specific hardcoding
                    const matchedKey = Object.keys(currentDataRow).find(k => {
                        const kl = k.toLowerCase();
                        return kl !== '_flat' && (kl.includes(sheetKey) || sheetKey.includes(kl));
                    });
                    if (matchedKey && currentDataRow[matchedKey][colKey] !== undefined) {
                        resolvedValue = DataResolver.safeString(currentDataRow[matchedKey][colKey]);
                    } else if (currentDataRow["_flat"] && currentDataRow["_flat"][colKey] !== undefined) {
                        resolvedValue = DataResolver.safeString(currentDataRow["_flat"][colKey]);
                    }
                }
            } else {
                const key = parts[0];
                if (currentDataRow && currentDataRow["_flat"] && currentDataRow["_flat"][key] !== undefined) {
                    resolvedValue = DataResolver.safeString(currentDataRow["_flat"][key]);
                }
            }
        } else {
            if (currentDataRow && currentDataRow["_flat"] && currentDataRow["_flat"][dataVal] !== undefined) {
                resolvedValue = DataResolver.safeString(currentDataRow["_flat"][dataVal]);
            }
        }

        const lowerVal = resolvedValue.toLowerCase().trim();
        if (lowerVal === "empty") {
            return "";
        }

        return resolvedValue;
    }
}

