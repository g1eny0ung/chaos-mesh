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
import {
  useDeleteExperiments,
  useDeleteExperimentsUid,
  useGetExperiments,
  usePutExperimentsPauseUid,
  usePutExperimentsStartUid,
} from '@/openapi'
import type { DeleteExperimentsParams, TypesExperiment } from '@/openapi/index.schemas'
import { useComponentActions } from '@/zustand/component'
import { useSystemStore } from '@/zustand/system'
import AddIcon from '@mui/icons-material/Add'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutlineOutlined'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import { Box, Button, Checkbox, IconButton, Link, Option, Select, Table, Typography } from '@mui/joy'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router'

import NotFound from '@/components/NotFound'
import PanelCard from '@/components/PanelCard'
import StatusLabel from '@/components/StatusLabel'
import i18n, { T } from '@/components/T'

import { transByKind } from '@/lib/byKind'
import DateTime, { format } from '@/lib/luxon'

type ExperimentAction = 'archive' | 'pause' | 'start'
const compactIconSx = { fontSize: 16 }

export default function Experiments() {
  const intl = useIntl()
  const navigate = useNavigate()
  const lang = useSystemStore((state) => state.lang)

  const { setAlert, setConfirm } = useComponentActions()

  const [batch, setBatch] = useState<Record<uuid, boolean>>({})
  const [kindFilter, setKindFilter] = useState('all')

  const { data: experiments = [], isLoading: loading, refetch } = useGetExperiments()
  const experimentKinds = Array.from(new Set(experiments.map((experiment) => experiment.kind).filter(Boolean)))
  const activeKindFilter = kindFilter === 'all' || experimentKinds.includes(kindFilter) ? kindFilter : 'all'
  const filteredExperiments =
    activeKindFilter === 'all' ? experiments : experiments.filter((experiment) => experiment.kind === activeKindFilter)
  const visibleUids = filteredExperiments.flatMap((experiment) =>
    experiment.uid && experiment.status !== 'deleting' ? [experiment.uid] : [],
  )
  const selectedUids = filteredExperiments.flatMap((experiment) =>
    experiment.uid && experiment.status !== 'deleting' && batch[experiment.uid] ? [experiment.uid] : [],
  )
  const selectedCount = selectedUids.length
  const visibleSelectedCount = visibleUids.filter((uid) => batch[uid]).length
  const { mutateAsync: deleteExperimentsByUUID } = useDeleteExperimentsUid()
  const { mutateAsync: deleteExperiments } = useDeleteExperiments()
  const { mutateAsync: pauseExperiments } = usePutExperimentsPauseUid()
  const { mutateAsync: startExperiments } = usePutExperimentsStartUid()

  const handleAction = (action: string, uuid?: uuid) => () => {
    let actionFunc
    let arg: { uid: string } | { params: DeleteExperimentsParams } | undefined
    const successAction = action === 'archiveMulti' ? 'archive' : action

    switch (action) {
      case 'archive':
        actionFunc = deleteExperimentsByUUID
        arg = { uid: uuid! }

        break
      case 'archiveMulti':
        actionFunc = deleteExperiments
        arg = { params: { uids: selectedUids.join(',') } }

        break
      case 'pause':
        actionFunc = pauseExperiments
        arg = { uid: uuid! }

        break
      case 'start':
        actionFunc = startExperiments
        arg = { uid: uuid! }

        break
    }

    if (actionFunc) {
      actionFunc(arg as any)
        .then(() => {
          if (action === 'archiveMulti') {
            setBatch({})
          }

          setAlert({
            type: 'success',
            message: i18n(`confirm.success.${successAction}`, intl),
          })

          refetch()
        })
        .catch(console.error)
    }
  }

  const confirmExperimentAction = (action: ExperimentAction, experiment: TypesExperiment) => {
    const titleKey = action === 'archive' ? 'archives.single' : `common.${action}`

    setConfirm({
      title: `${i18n(titleKey, intl)} ${experiment.name}`,
      description: i18n(`experiments.${action === 'archive' ? 'delete' : action}Desc`, intl),
      handle: handleAction(action, experiment.uid),
    })
  }

  const handleBatchSelectAll = () => {
    setBatch((current) => {
      const next = { ...current }
      const selectVisible = !visibleUids.every((uid) => current[uid])

      visibleUids.forEach((uid) => {
        if (selectVisible) {
          next[uid] = true
        } else {
          delete next[uid]
        }
      })

      return next
    })
  }

  const handleBatchDelete = () =>
    setConfirm({
      title: i18n('experiments.deleteMulti', intl),
      description: i18n('experiments.deleteDesc', intl),
      handle: handleAction('archiveMulti'),
    })

  const onCheckboxChange = (uuid: uuid) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked

    setBatch((current) => {
      if (checked) {
        return { ...current, [uuid]: true }
      }

      const next = { ...current }
      delete next[uuid]

      return next
    })
  }

  const handleKindFilterChange = (value: string | null) => {
    setKindFilter(value ?? 'all')
    setBatch({})
  }

  return (
    <>
      <Box
        component="header"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 'md',
              bgcolor: 'primary.softBg',
              color: 'primary.softColor',
            }}
          >
            <ScienceOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography component="h1" level="h2" sx={{ fontSize: 'xl' }}>
            {i18n('experiments.title')}
          </Typography>
        </Box>

        <Button
          size="sm"
          color="primary"
          startDecorator={<AddIcon sx={compactIconSx} />}
          onClick={() => navigate('/experiments/new')}
        >
          {i18n('newE.create')}
        </Button>
      </Box>

      <PanelCard sx={{ p: 0, gap: 0, minHeight: 360, overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ position: 'relative', minHeight: 360 }}>
            <Loading />
          </Box>
        ) : experiments.length > 0 ? (
          <Box sx={{ display: 'flex', flex: 1, minHeight: 0, flexDirection: 'column' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: 48,
                px: 2,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  size="sm"
                  aria-label={i18n('common.selectAll', intl)}
                  checked={visibleUids.length > 0 && visibleSelectedCount === visibleUids.length}
                  indeterminate={visibleSelectedCount > 0 && visibleSelectedCount < visibleUids.length}
                  onChange={handleBatchSelectAll}
                />
                <Typography level="body-sm" color="neutral">
                  <T
                    id={selectedCount > 0 ? 'experiments.selectedCount' : 'experiments.totalCount'}
                    values={{ count: selectedCount > 0 ? selectedCount : filteredExperiments.length }}
                  />
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {selectedCount > 0 && (
                  <Button
                    size="sm"
                    variant="plain"
                    color="neutral"
                    startDecorator={<ArchiveOutlinedIcon sx={compactIconSx} />}
                    onClick={handleBatchDelete}
                  >
                    {i18n('archives.single')}
                  </Button>
                )}
                <Select
                  size="sm"
                  variant="soft"
                  color="neutral"
                  value={activeKindFilter}
                  aria-label={i18n('experiments.typeFilter', intl)}
                  startDecorator={<FilterAltOutlinedIcon sx={compactIconSx} />}
                  onChange={(_, value) => handleKindFilterChange(value)}
                  sx={{ minWidth: 160 }}
                >
                  <Option value="all">{i18n('experiments.allTypes', intl)}</Option>
                  {experimentKinds.map((kind) => (
                    <Option key={kind} value={kind}>
                      {transByKind(kind as any)}
                    </Option>
                  ))}
                </Select>
              </Box>
            </Box>

            <Box sx={{ maxHeight: 'calc(100dvh - 210px)', overflow: 'auto' }}>
              <Table
                size="sm"
                sx={{
                  minWidth: 880,
                  '--TableCell-paddingX': '0.875rem',
                  '--Table-headerUnderlineThickness': '1px',
                  '& tbody td': { paddingBlock: '0.75rem', verticalAlign: 'middle' },
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: 24 }} />
                    <th>{i18n('common.name')}</th>
                    <th>{i18n('experiments.type')}</th>
                    <th>{i18n('k8s.namespace')}</th>
                    <th>{i18n('common.status')}</th>
                    <th>{i18n('table.created')}</th>
                    <th style={{ width: 160, paddingLeft: 20 }}>{i18n('common.operation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExperiments.map((experiment) => (
                    <tr key={experiment.uid}>
                      <td>
                        <Checkbox
                          size="sm"
                          aria-label={experiment.name}
                          checked={experiment.status !== 'deleting' && batch[experiment.uid!] === true}
                          disabled={experiment.status === 'deleting'}
                          onChange={onCheckboxChange(experiment.uid!)}
                        />
                      </td>
                      <td>
                        <Link
                          component="button"
                          level="title-sm"
                          underline="hover"
                          onClick={() => navigate(`/experiments/${experiment.uid}`)}
                        >
                          {experiment.name}
                        </Link>
                        <Typography level="body-xs" color="neutral" noWrap title={experiment.uid}>
                          {experiment.uid}
                        </Typography>
                      </td>
                      <td>{transByKind(experiment.kind as any)}</td>
                      <td>{experiment.namespace}</td>
                      <td>
                        <StatusLabel status={experiment.status ?? 'unknown'} />
                      </td>
                      <td>
                        <Typography level="body-sm" title={format(experiment.created_at!)}>
                          {DateTime.fromISO(experiment.created_at!, { locale: lang }).toRelative()}
                        </Typography>
                      </td>
                      <td>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {experiment.status === 'paused' ? (
                            <IconButton
                              size="sm"
                              variant="plain"
                              color="primary"
                              title={i18n('common.start', intl)}
                              onClick={() => confirmExperimentAction('start', experiment)}
                            >
                              <PlayCircleOutlineIcon sx={compactIconSx} />
                            </IconButton>
                          ) : experiment.status === 'running' || experiment.status === 'injecting' ? (
                            <IconButton
                              size="sm"
                              variant="plain"
                              color="neutral"
                              title={i18n('common.pause', intl)}
                              onClick={() => confirmExperimentAction('pause', experiment)}
                            >
                              <PauseCircleOutlineIcon sx={compactIconSx} />
                            </IconButton>
                          ) : null}
                          {experiment.status !== 'deleting' && (
                            <IconButton
                              size="sm"
                              variant="plain"
                              color="neutral"
                              title={i18n('archives.single', intl)}
                              onClick={() => confirmExperimentAction('archive', experiment)}
                            >
                              <ArchiveOutlinedIcon sx={compactIconSx} />
                            </IconButton>
                          )}
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </Box>
        ) : (
          <NotFound illustrated sx={{ minHeight: 360, textAlign: 'center' }}>
            <Typography>{i18n('experiments.notFound')}</Typography>
          </NotFound>
        )}
      </PanelCard>
    </>
  )
}
