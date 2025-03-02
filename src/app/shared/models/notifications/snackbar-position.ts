import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export enum SnackbarPosition {
    TopLeft,
    TopCenter,
    TopRight,
    BottomLeft,
    BottomCenter,
    BottomRight
}

export const SnackbarPositionMap = {
    [SnackbarPosition.TopLeft]: { horizontal: 'start' as MatSnackBarHorizontalPosition, vertical: 'top' as MatSnackBarVerticalPosition },
    [SnackbarPosition.TopCenter]: { horizontal: 'center' as MatSnackBarHorizontalPosition, vertical: 'top' as MatSnackBarVerticalPosition },
    [SnackbarPosition.TopRight]: { horizontal: 'end' as MatSnackBarHorizontalPosition, vertical: 'top' as MatSnackBarVerticalPosition },
    [SnackbarPosition.BottomLeft]: { horizontal: 'start' as MatSnackBarHorizontalPosition, vertical: 'bottom' as MatSnackBarVerticalPosition },
    [SnackbarPosition.BottomCenter]: { horizontal: 'center' as MatSnackBarHorizontalPosition, vertical: 'bottom' as MatSnackBarVerticalPosition },
    [SnackbarPosition.BottomRight]: { horizontal: 'end' as MatSnackBarHorizontalPosition, vertical: 'bottom' as MatSnackBarVerticalPosition }
}
