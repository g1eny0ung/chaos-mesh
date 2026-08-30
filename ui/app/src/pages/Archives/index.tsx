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
import Space from '@/mui-extends/Space'
import {
  useDeleteArchives,
  useDeleteArchivesSchedules,
  useDeleteArchivesSchedulesUid,
  useDeleteArchivesUid,
  useDeleteArchivesWorkflows,
  useDeleteArchivesWorkflowsUid,
  useGetArchives,
  useGetArchivesSchedules,
  useGetArchivesWorkflows,
} from '@/openapi'
import { useComponentActions } from '@/zustand/component'
import CloseIcon from '@mui/icons-material/Close'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import FilterListIcon from '@mui/icons-material/FilterList'
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { Box, Button, Checkbox, Typography, styled } from '@mui/material'
import Tab from '@mui/material/Tab'
import _ from 'lodash'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router'
import { List as RWList, type RowComponentProps as RWListRowComponentProps } from 'react-window'

import NotFound from '@/components/NotFound'
import ObjectListItem from '@/components/ObjectListItem'
import type { ObjectListItemAction } from '@/components/ObjectListItem'
import i18n from '@/components/T'

import { transByKind } from '@/lib/byKind'
import { useQuery } from '@/lib/hooks'

const StyledCheckBox = styled(Checkbox)({
  position: 'relative',
  left: -11,
  paddingRight: 0,
  '&:hover': {
    background: 'none !important',
  },
})

type PanelType = 'workflow' | 'schedule' | 'experiment'

export default function Archives() {
  const navigate = useNavigate()
  const intl = useIntl()
  const query = useQuery()
  const requestedKind = query.get('kind')
  const kind: PanelType =
    requestedKind === 'workflow' || requestedKind === 'schedule' || requestedKind === 'experiment'
      ? requestedKind
      : 'experiment'

  const { setAlert, setConfirm } = useComponentActions()

  const [batch, setBatch] = useState<Record<uuid, boolean>>({})
  const batchLength = Object.keys(batch).length
  const isBatchEmpty = batchLength === 0

  const experimentArchivesQuery = useGetArchives(undefined, {
    query: { enabled: kind === 'experiment' },
  })
  const scheduleArchivesQuery = useGetArchivesSchedules(undefined, {
    query: { enabled: kind === 'schedule' },
  })
  const workflowArchivesQuery = useGetArchivesWorkflows(undefined, {
    query: { enabled: kind === 'workflow' },
  })
  const {
    data: archives = [],
    isLoading: loading,
    refetch,
  } = kind === 'workflow'
    ? workflowArchivesQuery
    : kind === 'schedule'
      ? scheduleArchivesQuery
      : experimentArchivesQuery

  const { mutateAsync: deleteExperimentArchives } = useDeleteArchives()
  const { mutateAsync: deleteScheduleArchives } = useDeleteArchivesSchedules()
  const { mutateAsync: deleteWorkflowArchives } = useDeleteArchivesWorkflows()
  const deleteArchives =
    kind === 'workflow'
      ? deleteWorkflowArchives
      : kind === 'schedule'
        ? deleteScheduleArchives
        : deleteExperimentArchives

  const { mutateAsync: deleteExperimentArchive } = useDeleteArchivesUid()
  const { mutateAsync: deleteScheduleArchive } = useDeleteArchivesSchedulesUid()
  const { mutateAsync: deleteWorkflowArchive } = useDeleteArchivesWorkflowsUid()
  const deleteArchive =
    kind === 'workflow' ? deleteWorkflowArchive : kind === 'schedule' ? deleteScheduleArchive : deleteExperimentArchive

  const onSelect = (selected: ObjectListItemAction) =>
    setConfirm({
      title: selected.title,
      description: selected.description,
      handle: handleAction(selected.action, selected.uuid),
    })

  const handleActionSuccess = (action: string) => {
    setAlert({
      type: 'success',
      message: i18n(`confirm.success.${action}`, intl),
    })
  }

  const handleAction = (action: string, uuid?: uuid) => () => {
    switch (action) {
      case 'delete':
        deleteArchive({ uid: uuid! })
          .then(() => {
            handleActionSuccess(action)
            return refetch()
          })
          .catch(console.error)

        break
      case 'deleteMulti':
        deleteArchives({
          params: {
            uids: Object.keys(batch)
              .filter((d) => batch[d] === true)
              .join(','),
          },
        })
          .then(() => {
            handleActionSuccess(action)
            return refetch()
          })
          .catch(console.error)

        setBatch({})

        break
    }
  }

  const handleBatchSelect = () => {
    if (archives.length > 0) {
      setBatch(isBatchEmpty ? { [archives[0].uid!]: true } : {})
    }
  }

  const handleBatchSelectAll = () =>
    setBatch(
      batchLength <= archives.length
        ? archives.reduce<Record<uuid, boolean>>((acc, d) => {
            acc[d.uid!] = true

            return acc
          }, {})
        : {},
    )

  const handleBatchDelete = () =>
    setConfirm({
      title: i18n('archives.deleteMulti', intl),
      description: i18n('archives.deleteDesc', intl),
      handle: handleAction('deleteMulti'),
    })

  const onCheckboxChange = (uuid: uuid) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setBatch({
      ...batch,
      [uuid]: e.target.checked,
    })
  }

  const Row = ({ data, index, style }: RWListRowComponentProps<{ data: any[] }>) => (
    <Box
      style={style}
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 3,
      }}
    >
      {!isBatchEmpty && (
        <StyledCheckBox
          color="primary"
          checked={batch[data[index].uid] === true}
          onChange={onCheckboxChange(data[index].uid)}
          disableRipple
        />
      )}
      <Box
        sx={{
          flex: 1,
        }}
      >
        <ObjectListItem type="archive" archive={kind as any} data={data[index]} onSelect={onSelect} />
      </Box>
    </Box>
  )

  const onTabChange = (_: any, newValue: PanelType) => {
    navigate(`/archives?kind=${newValue}`)
  }

  return (
    <TabContext value={kind}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <TabList onChange={onTabChange}>
          <Tab label={i18n('workflows.title')} value="workflow" />
          <Tab label={i18n('schedules.title')} value="schedule" />
          <Tab label={i18n('experiments.title')} value="experiment" />
        </TabList>
      </Box>

      <Space direction="row" sx={{ my: 6 }}>
        <Button
          variant="outlined"
          startIcon={isBatchEmpty ? <FilterListIcon /> : <CloseIcon />}
          onClick={handleBatchSelect}
          disabled={archives.length === 0}
        >
          {i18n(`common.${isBatchEmpty ? 'batchOperation' : 'cancel'}`)}
        </Button>
        {!isBatchEmpty && (
          <>
            <Button variant="outlined" startIcon={<PlaylistAddCheckIcon />} onClick={handleBatchSelectAll}>
              {i18n('common.selectAll')}
            </Button>
            <Button variant="outlined" color="secondary" startIcon={<DeleteOutlinedIcon />} onClick={handleBatchDelete}>
              {i18n('common.delete')}
            </Button>
          </>
        )}
      </Space>

      {Object.entries(_.groupBy(archives, 'kind')).map(([kind, archivesByKind]) => (
        <Box
          key={kind}
          sx={{
            mb: 6,
          }}
        >
          <Typography variant="overline">{transByKind(kind as any)}</Typography>
          <RWList
            style={{ width: '100%', height: archivesByKind.length > 3 ? 300 : archivesByKind.length * 70 }}
            rowCount={archivesByKind.length}
            rowHeight={70}
            rowComponent={Row}
            rowProps={{ data: archivesByKind }}
          />
        </Box>
      ))}

      {!loading && archives.length === 0 && (
        <NotFound illustrated sx={{ textAlign: 'center' }}>
          <Typography>{i18n('archives.notFound')}</Typography>
        </NotFound>
      )}

      {loading && <Loading />}
    </TabContext>
  )
}
