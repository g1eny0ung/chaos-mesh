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
 *
 */
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import IconButton from '@mui/joy/IconButton'
import Snackbar from '@mui/joy/Snackbar'
import Typography from '@mui/joy/Typography'
import { useIntl } from 'react-intl'

export type AppSnackbarSeverity = 'success' | 'warning' | 'error'

interface AppSnackbarProps {
  autoHideDuration?: number
  message: React.ReactNode
  onClose: () => void
  open: boolean
  severity?: AppSnackbarSeverity
}

const severityConfig = {
  success: {
    color: 'success',
    icon: <CheckCircleRoundedIcon />,
  },
  warning: {
    color: 'warning',
    icon: <WarningRoundedIcon />,
  },
  error: {
    color: 'danger',
    icon: <ErrorRoundedIcon />,
  },
} as const

const AppSnackbar = ({ autoHideDuration = 4000, message, onClose, open, severity = 'success' }: AppSnackbarProps) => {
  const intl = useIntl()
  const { color, icon } = severityConfig[severity]

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={autoHideDuration}
      color={color}
      endDecorator={
        <IconButton
          aria-label={intl.formatMessage({ id: 'common.close' })}
          color={color}
          onClick={onClose}
          size="sm"
          variant="plain"
          sx={{ '--IconButton-size': '24px', '& svg': { fontSize: 14 } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      }
      onClose={onClose}
      open={open}
      size="sm"
      startDecorator={icon}
      variant="soft"
      sx={{
        minWidth: { sm: 288 },
        p: '6px 10px',
        gap: '6px',
        boxShadow: 'sm',
        '& .MuiSnackbar-startDecorator svg': { fontSize: 16 },
      }}
    >
      <Typography level="body-sm" sx={{ fontWeight: 'md', lineHeight: '20px' }}>
        {message}
      </Typography>
    </Snackbar>
  )
}

export default AppSnackbar
