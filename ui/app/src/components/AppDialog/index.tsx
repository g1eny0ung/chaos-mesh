/*
 * Copyright 2026 Chaos Mesh Authors.
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
 */
import { DialogContent, DialogTitle, Modal, ModalClose, ModalDialog } from '@mui/joy'
import type { ModalDialogProps, ModalProps } from '@mui/joy'

interface AppDialogProps {
  open: boolean
  title: React.ReactNode
  onClose?: () => void
  modalProps?: Omit<ModalProps, 'children' | 'onClose' | 'open'>
  modalDialogProps?: Omit<ModalDialogProps, 'children'>
  children: React.ReactNode
}

const AppDialog = ({ open, title, onClose, modalProps, modalDialogProps, children }: AppDialogProps) => {
  const { sx, ...restModalDialogProps } = modalDialogProps ?? {}

  return (
    <Modal {...modalProps} open={open} onClose={onClose ? () => onClose() : undefined}>
      <ModalDialog
        {...restModalDialogProps}
        sx={[
          {
            width: 440,
            maxWidth: 'calc(100vw - 32px)',
            maxHeight: 'calc(100dvh - 32px)',
            p: 0,
            borderRadius: 'lg',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {onClose && <ModalClose />}
        <DialogTitle sx={{ px: 3, pt: 3, pb: 2, pr: onClose ? 6 : 3 }}>{title}</DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>{children}</DialogContent>
      </ModalDialog>
    </Modal>
  )
}

export default AppDialog
