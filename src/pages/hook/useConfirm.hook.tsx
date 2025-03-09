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
