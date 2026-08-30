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
import Loading from '@/mui-extends/Loading'
import Paper from '@/mui-extends/Paper'
import PaperTop from '@/mui-extends/PaperTop'
import Space from '@/mui-extends/Space'
import { useGetArchivesSchedulesUid, useGetArchivesUid, useGetArchivesWorkflowsUid, useGetEvents } from '@/openapi'
import { Box, Grid, Grow } from '@mui/material'
import * as yaml from 'js-yaml'
import { lazy } from 'react'
import { useIntl } from 'react-intl'
import { useParams } from 'react-router'

import EventsTimeline from '@/components/EventsTimeline'
import HeadTitle from '@/components/HeadTitle'
import ObjectConfiguration from '@/components/ObjectConfiguration'
import i18n from '@/components/T'

import { useQuery } from '@/lib/hooks'

const YAMLEditor = lazy(() => import('@/components/YAMLEditor'))

const Single = () => {
  const { uuid } = useParams()
  const intl = useIntl()
  const query = useQuery()
  const requestedKind = query.get('kind')
  const kind =
    requestedKind === 'workflow' || requestedKind === 'schedule' || requestedKind === 'experiment'
      ? requestedKind
      : 'experiment'

  const experimentArchiveQuery = useGetArchivesUid(uuid!, {
    query: { enabled: kind === 'experiment' },
  })
  const scheduleArchiveQuery = useGetArchivesSchedulesUid(uuid!, {
    query: { enabled: kind === 'schedule' },
  })
  const workflowArchiveQuery = useGetArchivesWorkflowsUid(uuid!, {
    query: { enabled: kind === 'workflow' },
  })
  const { data: archive, isLoading: loadingArchives } =
    kind === 'workflow' ? workflowArchiveQuery : kind === 'schedule' ? scheduleArchiveQuery : experimentArchiveQuery
  const { data: events, isLoading: loadingEvents } = useGetEvents(
    {
      object_id: uuid,
      limit: 999,
    },
    { query: { enabled: kind !== 'workflow' } },
  )
  const loading = loadingArchives || (kind !== 'workflow' && loadingEvents)

  const YAML = () => (
    <Paper sx={{ height: kind === 'workflow' ? (theme) => `calc(100vh - 56px - ${theme.spacing(18)})` : 600, p: 0 }}>
      {archive && (
        <Space sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <PaperTop title={i18n('common.definition')} boxProps={{ sx: { p: 4.5, pb: 0 } }} />
          <Box
            sx={{
              flex: 1,
            }}
          >
            <YAMLEditor
              name={archive.name}
              data={yaml.dump(archive.kube_object)}
              download
              aceProps={{ readOnly: true }}
            />
          </Box>
        </Space>
      )}
    </Paper>
  )

  return (
    <>
      <HeadTitle title={`${i18n('archives.single', intl)}${archive?.name ? ` ${archive.name}` : ''}`} />
      <Grow in={!loading} style={{ transformOrigin: '0 0 0' }}>
        <div>
          {kind !== 'workflow' ? (
            <Space spacing={6}>
              {archive && (
                <Paper>
                  <ObjectConfiguration config={archive} inSchedule={kind === 'schedule'} inArchive={true} />
                </Paper>
              )}

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
                  <YAML />
                </Grid>
              </Grid>
            </Space>
          ) : (
            <YAML />
          )}
        </div>
      </Grow>

      {loading && <Loading />}
    </>
  )
}

export default Single
