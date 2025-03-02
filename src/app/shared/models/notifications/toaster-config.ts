import { ToasterPosition } from "./toaster-position";
import { ToasterType } from "./toaster-type";

export interface ToasterConfig {
    type: ToasterType,
    titleKey?: string | undefined,
    messageKey: string,
    position?: ToasterPosition | undefined,
    disableTimeOut?: boolean | undefined,
    timeOut?: number
}
