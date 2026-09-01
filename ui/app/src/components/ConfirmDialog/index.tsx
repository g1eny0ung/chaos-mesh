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
import { Button, DialogActions, Typography } from '@mui/joy'
import type { ButtonProps } from '@mui/joy'
import { useState } from 'react'

import AppDialog from '@/components/AppDialog'
import { T } from '@/components/T'

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  title: React.ReactNode
  description?: React.ReactNode
  cancelText?: React.ReactNode
  confirmText?: React.ReactNode
  confirmButtonProps?: Omit<ButtonProps, 'children' | 'loading' | 'onClick'>
  onConfirm: () => void | Promise<void>
}

const ConfirmDialog = ({
  open,
  onClose,
  title,
  description,
  cancelText,
  confirmText,
  confirmButtonProps,
  onConfirm,
}: ConfirmDialogProps) => {
  const [confirming, setConfirming] = useState(false)

  const handleClose = () => {
    if (!confirming) {
      onClose()
    }
  }

  const handleConfirm = async () => {
    setConfirming(true)

    try {
      await onConfirm()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setConfirming(false)
    }
  }

  return (
    <AppDialog open={open} onClose={handleClose} title={title}>
      {description != null && (
        <Typography level="body-sm" color="neutral">
          {description}
        </Typography>
      )}
      <DialogActions orientation="horizontal" sx={{ justifyContent: 'flex-end', px: 0, pb: 0, pt: 2 }}>
        <Button size="sm" variant="soft" color="neutral" disabled={confirming} autoFocus onClick={handleClose}>
          {cancelText ?? <T id="common.cancel" />}
        </Button>
        <Button
          {...confirmButtonProps}
          size={confirmButtonProps?.size ?? 'sm'}
          color={confirmButtonProps?.color ?? 'primary'}
          loading={confirming}
          onClick={handleConfirm}
        >
          {confirmText ?? <T id="common.confirm" />}
        </Button>
      </DialogActions>
    </AppDialog>
  )
}

export default ConfirmDialog
