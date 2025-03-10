import React, { ReactElement } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

type ConfirmButtonReturn = [
    (data?: any) => void,
    ReactElement
]

type ConfirmButtonProps = {
    onCancel?: () => void
    onConfirm: (data: any) => void,
    children?: any,
    confirmTitle?: string
    confirmOkText?: string
    confirmCancelText?: string
}
/**
 * @param {{
 *   onConfirm: (data: any) => void,
 *   children?: any,
 *   confirmTitle?: string,
 *   confirmOkText?: string,
 *   confirmCancelText?: string,
 *   onCancel?: () => void,
 *   [rest: string]: any
 * }} props
 * @returns [
 *  (data?: any) => void,
 *  ReactElement
 * ]
 *
 * A hook that returns a function and a ReactElement.
 * The function takes in an optional data argument and opens a confirmation dialog.
 * If the user confirms the dialog, the onConfirm function is called with the data argument.
 * If the user cancels the dialog, the onCancel function is called.
 * The ReactElement returned is a Dialog component that is opened when the returned function is called.
 */
export const useConfirm = ({
    onConfirm,
    children,
    confirmTitle,
    confirmOkText,
    confirmCancelText,
    onCancel,
    ...rest
}: ConfirmButtonProps): ConfirmButtonReturn => {
    const [open, setOpen] = React.useState<any | undefined>();

    return [
        (data: any) => setOpen(data ?? {}),
        <div>
            <Dialog
                open={Boolean(open)}
                onClose={() => {
                    setOpen(undefined)
                    onCancel?.()
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {confirmTitle ?? "Are you sure?"}
                </DialogTitle>
                <DialogActions sx={{ justifyContent: "center" }}>
                    <Button onClick={() => {
                        setOpen(undefined)
                        onCancel?.()
                    }}>
                        {confirmCancelText ?? "No"}
                    </Button>
                    <Button
                        color="error"
                        onClick={() => {
                            onConfirm(open!);
                            setOpen(undefined);
                        }}
                        autoFocus
                    >
                        {confirmOkText ?? "Yes"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    ]
};
