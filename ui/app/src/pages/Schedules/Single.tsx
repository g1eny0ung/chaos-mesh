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
import {
  useDeleteSchedulesUid,
  useGetEvents,
  useGetSchedulesUid,
  usePutSchedulesPauseUid,
  usePutSchedulesStartUid,
} from '@/openapi'
import { useComponentActions } from '@/zustand/component'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import { Stack } from '@mui/joy'
import { Box, Button, Grid, Grow } from '@mui/material'
import * as yaml from 'js-yaml'
import { lazy } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router'

import EventsTimeline from '@/components/EventsTimeline'
import HeadTitle from '@/components/HeadTitle'
import LoadingOverlay from '@/components/LoadingOverlay'
import ObjectConfiguration from '@/components/ObjectConfiguration'
import PanelCard from '@/components/PanelCard'
import PanelHeader from '@/components/PanelHeader'
import i18n from '@/components/T'

const YAMLEditor = lazy(() => import('@/components/YAMLEditor'))

const Single = () => {
  const navigate = useNavigate()
  const { uuid } = useParams()

  const intl = useIntl()

  const { setConfirm, setAlert } = useComponentActions()

  const { data: schedule, isLoading: isLoading1, refetch } = useGetSchedulesUid(uuid!)
  const { data: events, isLoading: isLoading2 } = useGetEvents({ object_id: uuid, limit: 999 })
  const loading = isLoading1 || isLoading2
  const { mutateAsync: deleteSchedules } = useDeleteSchedulesUid()
  const { mutateAsync: pauseSchedules } = usePutSchedulesPauseUid()
  const { mutateAsync: startSchedules } = usePutSchedulesStartUid()

  const handleSelect = (action: string) => () => {
    switch (action) {
      case 'archive':
        setConfirm({
          title: `${i18n('archives.single', intl)} ${schedule!.name}`,
          description: i18n('experiments.deleteDesc', intl),
          handle: handleAction('archive'),
        })

        break
      case 'pause':
        setConfirm({
          title: `${i18n('common.pause', intl)} ${schedule!.name}`,
          description: i18n('experiments.pauseDesc', intl),
          handle: handleAction('pause'),
        })

        break
      case 'start':
        setConfirm({
          title: `${i18n('common.start', intl)} ${schedule!.name}`,
          description: i18n('experiments.startDesc', intl),
          handle: handleAction('start'),
        })

        break
    }
  }

  const handleAction = (action: string) => () => {
    let actionFunc

    switch (action) {
      case 'archive':
        actionFunc = deleteSchedules

        break
      case 'pause':
        actionFunc = pauseSchedules

        break
      case 'start':
        actionFunc = startSchedules

        break
      default:
        break
    }

    if (actionFunc) {
      actionFunc({ uid: uuid! })
        .then(() => {
          setAlert({
            type: 'success',
            message: i18n(`confirm.success.${action}`, intl),
          })

          if (action === 'archive') {
            navigate('/schedules')
          }

          if (action === 'pause' || action === 'start') {
            refetch()
          }
        })
        .catch(console.error)
    }
  }

  return (
    <>
      <HeadTitle title={`${i18n('schedules.single', intl)}${schedule?.name ? ` ${schedule.name}` : ''}`} />
      <Grow in={!loading} style={{ transformOrigin: '0 0 0' }}>
        <div>
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ArchiveOutlinedIcon />}
                onClick={handleSelect('archive')}
              >
                {i18n('archives.single')}
              </Button>
              {schedule?.status === 'paused' ? (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PlayCircleOutlineIcon />}
                  onClick={handleSelect('start')}
                >
                  {i18n('common.start')}
                </Button>
              ) : null}
            </Stack>

            <PanelCard>{schedule && <ObjectConfiguration config={schedule} inSchedule />}</PanelCard>

            <Grid container>
              <Grid
                sx={{ pr: 3 }}
                size={{
                  xs: 12,
                  lg: 6,
                }}
              >
                <EventsTimeline events={events} paperProps={{ sx: { height: 600 } }} />
              </Grid>
              <Grid
                sx={{ pl: 3 }}
                size={{
                  xs: 12,
                  lg: 6,
                }}
              >
                <PanelCard sx={{ height: 600, p: 0, overflow: 'hidden' }}>
                  {schedule && (
                    <Stack spacing={0} sx={{ height: '100%' }}>
                      <PanelHeader title={i18n('common.definition')} boxProps={{ sx: { p: 2.25, pb: 0 } }} />
                      <Box
                        sx={{
                          flex: 1,
                        }}
                      >
                        <YAMLEditor name={schedule.name} data={yaml.dump(schedule.kube_object)} download />
                      </Box>
                    </Stack>
                  )}
                </PanelCard>
              </Grid>
            </Grid>
          </Stack>
        </div>
      </Grow>

      {loading && <LoadingOverlay />}
    </>
  )
}

export default Single
