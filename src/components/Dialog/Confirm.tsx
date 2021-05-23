import Dialog from "@material-ui/core/Dialog";
import * as React from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export interface IConfirmDialogProps {
  isOpen: boolean;
  isConfirm?: boolean;
  disabled?: boolean;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  content: string | React.ReactElement<any>;
  onClose: (result: boolean) => void;
}

const onCancel = (cb: (result: boolean) => void) => () => {
  cb(false);
};
const onOK = (cb: (result: boolean) => void) => () => {
  cb(true);
};

const ConfirmDialog = ({
  isConfirm,
  isOpen,
  title,
  content,
  onClose,
  disabled,
  confirmText,
  cancelText
}: IConfirmDialogProps) => (
  <Dialog
    disableBackdropClick={true}
    disableEscapeKeyDown={true}
    open={isOpen}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {title || "Confirm action"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      {!isConfirm && (
        <Button disabled={disabled} onClick={onCancel(onClose)} color="primary">
          {cancelText || "Cancel"}
        </Button>
      )}
      <Button
        disabled={disabled}
        onClick={onOK(onClose)}
        color="primary"
        autoFocus={true}
      >
        {confirmText || "Confirm"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
