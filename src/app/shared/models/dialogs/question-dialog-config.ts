export interface QuestionDialogConfig {
    titleKey: string,
    titleParameters?: any | undefined,
    messageKey: string,
    messageParameters?: any | undefined,
    noButtonTextKey: string,
    yesButtonTextKey: string,
    onNoClicked?: () => void | undefined,
    onYesClicked?: () => void | undefined,
    onClosed?: (data?: any) => void | undefined
};
