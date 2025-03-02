import { Warehouse } from "../../core/contracts/warehouse";
import { LocalizationService } from "../../core/services/localization.service";
import { ToasterType } from "../models/notifications/toaster-type";
import { ToasterNotificationService } from "../services/notifications/toaster-notification.service";
import * as ExcelJS from 'exceljs'

export function flattenJsonLocalization(json: any,
                                        localizationService: LocalizationService,
                                        localizationPrefix: string,
                                        parentKey = '',
                                        result: any = {}): any {
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}-${key}` : key;
            if (typeof json[key] === 'object' && json[key] !== null) {
                flattenJsonLocalization(json[key], localizationService, localizationPrefix, newKey, result);
            } else {
                const columnName = localizationService.getLocalizedTextInstant(localizationPrefix + newKey);
                result[columnName] = json[key];
            }
        }
    }
    
    return result;
}

export function flattenJson(json: any, parentKey = '', result: any = {}): any {
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            const newKey = parentKey ? `${parentKey}-${key}` : key;
            if (typeof json[key] === 'object' && json[key] !== null) {
                flattenJson(json[key], newKey, result);
            } else {
                result[newKey] = json[key];
            }
        }
    }

    return result;
}

export async function downloadWarehousesExcel(warehouses: Warehouse[],
                                              toasterNotificationService: ToasterNotificationService,
                                              localizationService: LocalizationService,
                                              fileNameKey: string,
                                              downloadFailKey: string): Promise<void> {
    if (!warehouses) {
        toasterNotificationService.showToaster({
            type: ToasterType.Warning,
            messageKey: downloadFailKey,
            disableTimeOut: true
        });
  
        return;
    }

    toasterNotificationService.showToaster({
        type: ToasterType.Info,
        messageKey: 'excel.download-started',
    });
  
    try {
        const fileName = await localizationService.getLocalizedText(fileNameKey);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(fileName);

        for (const warehouse of warehouses) {
            warehouse.type = await localizationService.getLocalizedText('table.warehouse.' + warehouse.type);
        }
      
        const flattenedJson: any[] = warehouses.map((d: any) => flattenJsonLocalization(d, localizationService, 'excel.warehouse.column-names.'));
        worksheet.columns = Object.keys(flattenedJson[0]).map(key => ({ header: key, key: key }));
      
        flattenedJson.forEach((item) => {
            worksheet.addRow(item);
        });
      
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName + '.xlsx';
            link.click();
        });
      
        toasterNotificationService.showToaster({
            type: ToasterType.Success,
            messageKey: 'excel.download-success'
        });
    }
    catch {
        toasterNotificationService.showToaster({
            type: ToasterType.Warning,
            messageKey: downloadFailKey,
            disableTimeOut: true
        });
    }
}
