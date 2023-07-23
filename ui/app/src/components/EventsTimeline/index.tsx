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
import NotFound from '@/components/NotFound'
import i18n from '@/components/T'
import { iconByKind } from '@/lib/byKind'
import DateTime, { format } from '@/lib/luxon'
import { CoreEvent } from '@/openapi/index.schemas'
import useSettingsStore from '@/zustand/settings'
import { Box, Chip, List, ListItem, ListItemContent, ListItemDecorator, Typography } from '@mui/joy'

interface EventsTimelineProps {
  events?: CoreEvent[]
  height?: number
}

const EventsTimeline: React.FC<EventsTimelineProps> = ({ events, height }) => {
  const [lang] = useSettingsStore((state) => [state.lang])

  return (
    <Box sx={{ height, overflowY: 'auto' }}>
      {events && events.length > 0 ? (
        <List>
          {events.map((event) => (
            <ListItem key={event.id}>
              <ListItemDecorator>{iconByKind(event.kind!, 'small')}</ListItemDecorator>
              <ListItemContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography>{event.name}</Typography>
                  <Chip variant="soft" size="sm">
                    {event.reason}
                  </Chip>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography level="body2" noWrap maxWidth="75%" textOverflow="ellipsis" title={event.message}>
                    {event.message}
                  </Typography>
                  <Typography level="body3" title={format(event.created_at!)}>
                    {DateTime.fromISO(event.created_at!, {
                      locale: lang,
                    }).toRelative()}
                  </Typography>
                </Box>
              </ListItemContent>
            </ListItem>
          ))}
        </List>
      ) : (
        <NotFound>{i18n('events.notFound')}</NotFound>
      )}
    </Box>
  )
}

export default EventsTimeline
