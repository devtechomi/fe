import { SnackbarPosition } from "./snackbar-position";

export interface SnackbarConfig {
    messageKey: string,
    position?: SnackbarPosition | undefined,
    duration?: number | undefined,
    isLoading?: boolean | undefined,
    buttonIcon?: string | undefined,
    buttonAction?: () => void | undefined
}
