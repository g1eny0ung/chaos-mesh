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
import PaperTop from '@/mui-extends/PaperTop'
import Space from '@/mui-extends/Space'
import {
  useDeleteExperimentsUid,
  useGetEvents,
  useGetExperimentsUid,
  usePutExperimentsPauseUid,
  usePutExperimentsStartUid,
} from '@/openapi'
import { useComponentActions } from '@/zustand/component'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import { Alert, Box, Button, Grid, Typography } from '@mui/joy'
import * as yaml from 'js-yaml'
import { lazy } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate, useParams } from 'react-router'

import EventsTimeline from '@/components/EventsTimeline'
import HeadTitle from '@/components/HeadTitle'
import NotFound from '@/components/NotFound'
import ObjectConfiguration from '@/components/ObjectConfiguration'
import PanelCard from '@/components/PanelCard'
import StatusLabel from '@/components/StatusLabel'
import i18n from '@/components/T'

import { iconByKind } from '@/lib/byKind'

const YAMLEditor = lazy(() => import('@/components/YAMLEditor'))
const compactIconSx = { fontSize: 16 }

export default function Single() {
  const navigate = useNavigate()
  const { uuid } = useParams()

  const intl = useIntl()

  const { setConfirm, setAlert } = useComponentActions()

  const { data: experiment, isLoading: isLoading1, refetch } = useGetExperimentsUid(uuid!)
  const { data: events, isLoading: isLoading2 } = useGetEvents({ object_id: uuid, limit: 999 })
  const loading = isLoading1 || isLoading2
  const { mutateAsync: deleteExperiments } = useDeleteExperimentsUid()
  const { mutateAsync: pauseExperiments } = usePutExperimentsPauseUid()
  const { mutateAsync: startExperiments } = usePutExperimentsStartUid()

  const handleSelect = (action: string) => () => {
    switch (action) {
      case 'archive':
        setConfirm({
          title: `${i18n('archives.single', intl)} ${experiment!.name}`,
          description: i18n('experiments.deleteDesc', intl),
          handle: handleAction('archive'),
        })

        break
      case 'pause':
        setConfirm({
          title: `${i18n('common.pause', intl)} ${experiment!.name}`,
          description: i18n('experiments.pauseDesc', intl),
          handle: handleAction('pause'),
        })

        break
      case 'start':
        setConfirm({
          title: `${i18n('common.start', intl)} ${experiment!.name}`,
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
        actionFunc = deleteExperiments

        break
      case 'pause':
        actionFunc = pauseExperiments

        break
      case 'start':
        actionFunc = startExperiments

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
            navigate('/experiments')
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
      <HeadTitle title={`${i18n('experiments.single', intl)}${experiment?.name ? ` ${experiment.name}` : ''}`} />
      {!loading && experiment && (
        <Box
          sx={{
            transformOrigin: '0 0 0',
            animation: 'experiment-content-in 300ms ease-out',
            '@keyframes experiment-content-in': {
              from: { opacity: 0, transform: 'scale(0.9)' },
              to: { opacity: 1, transform: 'scale(1)' },
            },
          }}
        >
          <Space spacing={2}>
            <Box
              component="header"
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                {experiment && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      flex: '0 0 auto',
                      borderRadius: 'md',
                      bgcolor: 'primary.softBg',
                      color: 'primary.softColor',
                    }}
                  >
                    {iconByKind(experiment.kind!, 'small')}
                  </Box>
                )}
                <Typography component="h1" level="h4">
                  {experiment?.name}
                </Typography>
                {experiment && <StatusLabel status={experiment.status ?? 'unknown'} />}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {experiment.status === 'paused' ? (
                  <Button
                    size="sm"
                    color="primary"
                    startDecorator={<PlayCircleOutlineIcon sx={compactIconSx} />}
                    onClick={handleSelect('start')}
                  >
                    {i18n('common.start')}
                  </Button>
                ) : experiment.status === 'running' || experiment.status === 'injecting' ? (
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    startDecorator={<PauseCircleOutlineIcon sx={compactIconSx} />}
                    onClick={handleSelect('pause')}
                  >
                    {i18n('common.pause')}
                  </Button>
                ) : null}
                {experiment.status !== 'deleting' && (
                  <Button
                    size="sm"
                    variant="soft"
                    color="neutral"
                    startDecorator={<ArchiveOutlinedIcon sx={compactIconSx} />}
                    onClick={handleSelect('archive')}
                  >
                    {i18n('archives.single')}
                  </Button>
                )}
              </Box>
            </Box>

            {experiment?.failed_message && (
              <Alert color="danger" variant="soft">
                An error occurred: <b>{experiment.failed_message}</b>
              </Alert>
            )}

            <PanelCard>{experiment && <ObjectConfiguration config={experiment} hideHeader />}</PanelCard>

            <Grid container spacing={2}>
              <Grid xs={12} lg={6}>
                <EventsTimeline events={events} paperProps={{ sx: { height: 600 } }} />
              </Grid>
              <Grid xs={12} lg={6}>
                <PanelCard sx={{ height: 600, p: 0, overflow: 'hidden' }}>
                  {experiment && (
                    <Space spacing={0} sx={{ height: '100%' }}>
                      <PaperTop title={i18n('common.definition')} boxProps={{ sx: { px: 3, pt: 3, pb: 2 } }} />
                      <Box
                        sx={{
                          flex: 1,
                        }}
                      >
                        <YAMLEditor name={experiment.name} data={yaml.dump(experiment.kube_object)} download />
                      </Box>
                    </Space>
                  )}
                </PanelCard>
              </Grid>
            </Grid>
          </Space>
        </Box>
      )}

      {!loading && !experiment && (
        <NotFound illustrated sx={{ minHeight: 360, textAlign: 'center' }}>
          <Typography>{i18n('experiments.notFound')}</Typography>
        </NotFound>
      )}

      {loading && <Loading />}
    </>
  )
}
