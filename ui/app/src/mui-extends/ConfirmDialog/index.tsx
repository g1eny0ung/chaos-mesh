/*
 * Copyright 2021 Chaos Mesh Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { Button, DialogActions, DialogContent, DialogTitle, Modal, ModalDialog, Typography } from '@mui/joy'

interface LegacyDialogProps {
  slotProps?: {
    paper?: {
      style?: React.CSSProperties
    }
  }
}

interface ConfirmDialogProps {
  open: boolean
  close?: () => void
  title: React.ReactNode
  description?: React.ReactNode
  cancelText?: string
  confirmText?: string
  onConfirm?: () => void
  dialogProps?: LegacyDialogProps
}

const ConfirmDialog: ReactFCWithChildren<ConfirmDialogProps> = ({
  open,
  close,
  title,
  description,
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  onConfirm,
  children,
  dialogProps,
}) => {
  const handleConfirm = () => {
    if (typeof onConfirm === 'function') {
      onConfirm()
    }

    if (typeof close === 'function') {
      close()
    }
  }

  const dialogStyle = dialogProps?.slotProps?.paper?.style

  return (
    <Modal open={open} onClose={() => close?.()}>
      <ModalDialog
        style={dialogStyle}
        sx={{ width: 440, maxWidth: 'calc(100vw - 32px)', maxHeight: 'calc(100dvh - 32px)', p: 0, borderRadius: 'lg' }}
      >
        <DialogTitle sx={{ px: 3, pt: 3, pb: 2 }}>{title}</DialogTitle>
        {(children || description) && (
          <DialogContent sx={{ px: 3, pb: onConfirm ? 1 : 3 }}>
            {description ? (
              <Typography level="body-sm" color="neutral">
                {description}
              </Typography>
            ) : (
              children
            )}
          </DialogContent>
        )}

        {onConfirm && (
          <DialogActions orientation="horizontal" sx={{ justifyContent: 'flex-end', px: 3, pb: 3, pt: 2 }}>
            <Button size="sm" variant="soft" color="neutral" onClick={close}>
              {cancelText}
            </Button>
            <Button size="sm" color="primary" autoFocus onClick={handleConfirm}>
              {confirmText}
            </Button>
          </DialogActions>
        )}
      </ModalDialog>
    </Modal>
  )
}

export default ConfirmDialog
