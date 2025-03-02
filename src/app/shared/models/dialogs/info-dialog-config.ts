export interface InfoDialogConfig {
    titleKey: string,
    titleParameters?: any | undefined,
    messageKey: string,
    messageParameters?: any | undefined,
    buttonTextKey: string,
    focusOnButton?: boolean | undefined,
    onButtonClicked?: () => void | undefined,
    onClosed?: (data?: any) => void | undefined
}
