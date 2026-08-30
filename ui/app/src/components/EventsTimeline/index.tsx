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
import PaperTop from '@/mui-extends/PaperTop'
import { type CoreEvent } from '@/openapi/index.schemas'
import { useSettingActions, useSettingStore } from '@/zustand/setting'
import { useSystemStore } from '@/zustand/system'
import { Box, Chip, List, ListItem, ListItemContent, ListItemDecorator, Switch, Typography } from '@mui/joy'

import i18n from '@/components/T'

import { iconByKind } from '@/lib/byKind'
import { format, toRelative } from '@/lib/luxon'

interface EventsTimelineProps {
  events?: CoreEvent[]
  height?: number
  paperProps?: React.ComponentProps<typeof Paper>
}

const EventsTimeline: React.FC<EventsTimelineProps> = ({ events, height, paperProps }) => {
  const lang = useSystemStore((state) => state.lang)
  const eventTimeFormat = useSettingStore((state) => state.eventTimeFormat)
  const { setEventTimeFormat } = useSettingActions()

  const handleEventTimeFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventTimeFormat(event.target.checked ? 'absolute' : 'relative')
  }

  const toggle = (
    <Switch
      size="sm"
      checked={eventTimeFormat === 'absolute'}
      onChange={handleEventTimeFormatChange}
      startDecorator={i18n('events.absoluteTime')}
    />
  )

  const eventList = (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {events && events.length > 0 ? (
        <List>
          {events.map((event) => (
            <ListItem key={event.id}>
              <ListItemDecorator>{iconByKind(event.kind!)}</ListItemDecorator>
              <ListItemContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography>{event.name}</Typography>
                  <Chip variant="soft" size="sm">
                    {event.reason}
                  </Chip>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    level="body-sm"
                    noWrap
                    title={event.message}
                    sx={{
                      maxWidth: '75%',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {event.message}
                  </Typography>
                  <Typography level="body-xs" title={format(event.created_at!)}>
                    {eventTimeFormat === 'absolute'
                      ? format(event.created_at!, lang)
                      : toRelative(event.created_at!, lang)}
                  </Typography>
                </Box>
              </ListItemContent>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography color="neutral">{i18n('events.notFound')}</Typography>
        </Box>
      )}
    </Box>
  )

  if (paperProps) {
    return (
      <Paper {...paperProps} sx={{ display: 'flex', flexDirection: 'column', ...paperProps.sx }}>
        <PaperTop title={paperProps.title || i18n('events.title')} boxProps={{ sx: { mb: 3 } }}>
          {toggle}
        </PaperTop>
        {eventList}
      </Paper>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>{toggle}</Box>
      {eventList}
    </Box>
  )
}

export default EventsTimeline
