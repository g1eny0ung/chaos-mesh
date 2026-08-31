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
import PaperTop from '@/mui-extends/PaperTop'
import { type CoreEvent } from '@/openapi/index.schemas'
import { useSettingStore } from '@/zustand/setting'
import { useSystemStore } from '@/zustand/system'
import { Box, Chip, List, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'

import PanelCard from '@/components/PanelCard'
import i18n from '@/components/T'

import { iconByKind } from '@/lib/byKind'
import { format, toRelative } from '@/lib/luxon'

interface EventsTimelineProps {
  events?: CoreEvent[]
  height?: number
  paperProps?: React.ComponentProps<typeof PanelCard>
}

const EventsTimeline: React.FC<EventsTimelineProps> = ({ events, height, paperProps }) => {
  const lang = useSystemStore((state) => state.lang)
  const eventTimeFormat = useSettingStore((state) => state.eventTimeFormat)

  const eventList = (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {events && events.length > 0 ? (
        <List size="sm" sx={{ '--ListItem-paddingX': 0 }}>
          {events.map((event) => (
            <ListItem key={event.id} sx={{ gap: 2 }}>
              <ListItemDecorator sx={{ '& svg': { fontSize: 18 } }}>
                {iconByKind(event.kind!, 'inherit')}
              </ListItemDecorator>
              <ListItemContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography level="body-sm" title={event.message} sx={{ overflowWrap: 'anywhere' }}>
                      {event.message}
                    </Typography>
                    <Typography level="body-xs" color="neutral" title={format(event.created_at!)} sx={{ mt: 0.5 }}>
                      {eventTimeFormat === 'absolute'
                        ? format(event.created_at!, lang)
                        : toRelative(event.created_at!, lang)}
                    </Typography>
                  </Box>
                  <Chip variant="soft" size="sm">
                    {event.reason}
                  </Chip>
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
      <PanelCard {...paperProps}>
        <PaperTop title={paperProps.title || i18n('events.title')} />
        {eventList}
      </PanelCard>
    )
  }

  return <Box sx={{ display: 'flex', flexDirection: 'column', height }}>{eventList}</Box>
}

export default EventsTimeline
