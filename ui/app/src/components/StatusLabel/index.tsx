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
import { PauseCircleOutlined, TaskAltOutlined } from '@mui/icons-material'
import { Chip, ColorPaletteProp } from '@mui/joy'

import { T } from '@/components/T'

const statusColors: Record<string, ColorPaletteProp> = {
  injecting: 'neutral',
  running: 'success',
  paused: 'warning',
  finished: 'primary',
  deleting: 'neutral',
  failed: 'danger',
}

interface StatusLabelProps {
  status: string | [string, number]
}

const StatusLabel: React.FC<StatusLabelProps> = ({ status }) => {
  const _status = typeof status === 'string' ? status : status[0]

  let color
  switch (_status) {
    case 'injecting':
    case 'running':
    case 'paused':
    case 'deleting':
    case 'finished':
    case 'failed':
      color = statusColors[_status]

      break
    case 'unknown':
    default:
      color = statusColors['deleting']

      break
  }

  let icon
  switch (_status) {
    case 'injecting':
    case 'running':
    case 'deleting':
      icon = <TaskAltOutlined />

      break
    case 'paused':
      icon = <PauseCircleOutlined />

      break
  }

  return typeof status === 'string' ? (
    <Chip variant="soft" size="sm" startDecorator={icon} color={color}>
      <T id={`status.${status}`} />
    </Chip>
  ) : (
    <Chip variant="soft" size="sm" startDecorator={icon} color={color}>
      {status[1]} <T id={`status.${status[0]}`} />
    </Chip>
  )
}

export default StatusLabel
