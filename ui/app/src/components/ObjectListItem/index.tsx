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
import Paper from '@/mui-extends/Paper'
import Space from '@/mui-extends/Space'
import type { TypesArchive, TypesExperiment, TypesSchedule } from '@/openapi/index.schemas'
import { useSystemStore } from '@/zustand/system'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import { Box, IconButton, Typography } from '@mui/joy'
import _ from 'lodash'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import StatusLabel from '@/components/StatusLabel'
import i18n from '@/components/T'

import DateTime, { format } from '@/lib/luxon'

export interface ObjectListItemAction {
  uuid: uuid
  title: string
  description: string
  action: string
}

interface ObjectListItemProps {
  type?: 'schedule' | 'experiment' | 'archive'
  archive?: 'workflow' | 'schedule' | 'experiment'
  data: TypesSchedule | TypesExperiment | TypesArchive
  onSelect: (info: ObjectListItemAction) => void
}
const compactIconSx = { fontSize: 16 }

const ObjectListItem: ReactFCWithChildren<ObjectListItemProps> = ({ data, type = 'experiment', archive, onSelect }) => {
  const navigate = useNavigate()
  const intl = useIntl()

  const lang = useSystemStore((state) => state.lang)

  const handleAction = (action: string) => (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    switch (action) {
      case 'archive':
        onSelect({
          title: `${i18n('archives.single', intl)} ${data.name}`,
          description: i18n(`${type}s.deleteDesc`, intl),
          action,
          uuid: data.uid!,
        })

        return
      case 'pause':
        onSelect({
          title: `${i18n('common.pause', intl)} ${data.name}`,
          description: i18n('experiments.pauseDesc', intl),
          action,
          uuid: data.uid!,
        })

        return
      case 'start':
        onSelect({
          title: `${i18n('common.start', intl)} ${data.name}`,
          description: i18n('experiments.startDesc', intl),
          action,
          uuid: data.uid!,
        })

        return
      case 'delete':
        onSelect({
          title: `${i18n('common.delete', intl)} ${data.name}`,
          description: i18n('archives.deleteDesc', intl),
          action,
          uuid: data.uid!,
        })

        return
      default:
        return
    }
  }

  const handleJumpTo = () => {
    let path
    switch (type) {
      case 'schedule':
      case 'experiment':
        path = `/${type}s/${data.uid}`
        break
      case 'archive':
        path = `/archives/${data.uid}?kind=${archive!}`
        break
    }

    navigate(path)
  }

  const actions = (
    <Space direction="row" sx={{ alignItems: 'center' }}>
      <Typography level="body-sm" color="neutral" title={format(data.created_at!)}>
        {i18n('table.created')}{' '}
        {DateTime.fromISO(data.created_at!, {
          locale: lang,
        }).toRelative()}
      </Typography>
      {(type === 'schedule' || type === 'experiment') &&
        ((data as any).status === 'paused' ? (
          <IconButton
            color="primary"
            variant="plain"
            title={i18n('common.start', intl)}
            size="sm"
            onClick={handleAction('start')}
          >
            <PlayCircleOutlineIcon sx={compactIconSx} />
          </IconButton>
        ) : (data as any).status === 'running' || (data as any).status === 'injecting' ? (
          <IconButton
            color="neutral"
            variant="plain"
            title={i18n('common.pause', intl)}
            size="sm"
            onClick={handleAction('pause')}
          >
            <PauseCircleOutlineIcon sx={compactIconSx} />
          </IconButton>
        ) : null)}
      {type !== 'archive' && (data as any).status !== 'deleting' && (
        <IconButton
          color="neutral"
          variant="plain"
          title={i18n('archives.single', intl)}
          size="sm"
          onClick={handleAction('archive')}
        >
          <ArchiveOutlinedIcon sx={compactIconSx} />
        </IconButton>
      )}
      {type === 'archive' && (
        <IconButton
          color="danger"
          variant="plain"
          title={i18n('common.delete', intl)}
          size="sm"
          onClick={handleAction('delete')}
        >
          <DeleteOutlinedIcon sx={compactIconSx} />
        </IconButton>
      )}
    </Space>
  )

  return (
    <Paper
      sx={{
        p: 0,
        ':hover': {
          bgcolor: 'neutral.softHoverBg',
          cursor: 'pointer',
        },
      }}
      onClick={handleJumpTo}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Space direction="row" sx={{ alignItems: 'center' }}>
          {type !== 'archive' && <StatusLabel status={(data as any).status} />}
          <Typography level="title-sm" component="div" title={data.name}>
            {_.truncate(data.name!)}
          </Typography>
          <Typography component="div" level="body-sm" color="neutral" title={data.uid}>
            {_.truncate(data.uid!)}
          </Typography>
        </Space>

        {actions}
      </Box>
    </Paper>
  )
}

export default ObjectListItem
