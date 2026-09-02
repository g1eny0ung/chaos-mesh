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
import { getWorkflowsUid, useDeleteWorkflowsUid, useGetWorkflows, usePostWorkflows } from '@/openapi'
import type { CoreWorkflowMeta } from '@/openapi/index.schemas'
import { useComponentActions } from '@/zustand/component'
import { useSystemStore } from '@/zustand/system'
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import AddIcon from '@mui/icons-material/Add'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ReplayIcon from '@mui/icons-material/Replay'
import { Box, Button, IconButton, Link, Table, Typography } from '@mui/joy'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router'
import { v4 as uuidv4 } from 'uuid'

import LoadingOverlay from '@/components/LoadingOverlay'
import NotFound from '@/components/NotFound'
import PanelCard from '@/components/PanelCard'
import StatusLabel from '@/components/StatusLabel'
import i18n, { T } from '@/components/T'

import { comparator, format, toRelative } from '@/lib/luxon'

const compactIconSx = { fontSize: 16 }

function transformWorkflows(data: CoreWorkflowMeta[]) {
  return [...data].sort((a, b) => comparator(b.created_at!, a.created_at!))
}

export default function Workflows() {
  const navigate = useNavigate()
  const intl = useIntl()
  const lang = useSystemStore((state) => state.lang)

  const { setAlert, setConfirm } = useComponentActions()

  const {
    data: workflows = [],
    isLoading,
    refetch,
  } = useGetWorkflows(undefined, {
    query: {
      select: transformWorkflows,
    },
  })
  const { mutateAsync: deleteWorkflows } = useDeleteWorkflowsUid()
  const { mutateAsync: createWorkflows } = usePostWorkflows()

  const handleArchive = (workflow: CoreWorkflowMeta) =>
    setConfirm({
      title: `${i18n('archives.single', intl)} ${workflow.name}`,
      description: i18n('workflows.deleteDesc', intl),
      handle: () => {
        deleteWorkflows({ uid: workflow.uid! })
          .then(() => {
            setAlert({
              type: 'success',
              message: i18n('confirm.success.archive', intl),
            })

            refetch()
          })
          .catch(console.error)
      },
    })

  const handleReRun = async (uid: uuid) => {
    const { name, kube_object } = await getWorkflowsUid(uid)

    setConfirm({
      title: intl.formatMessage({ id: 'workflows.rerunTitle' }, { name }),
      description: i18n('workflows.rerunDesc', intl),
      handle: () => {
        createWorkflows({
          data: {
            apiVersion: 'chaos-mesh.org/v1alpha1',
            kind: 'Workflow',
            metadata: {
              ...kube_object!.metadata,
              name: `${name}-${uuidv4()}`,
            },
            spec: kube_object!.spec,
          } as any,
        })
          .then(() => {
            setAlert({
              type: 'success',
              message: i18n('confirm.success.create', intl),
            })

            refetch()
          })
          .catch(console.error)
      },
    })
  }

  const workflowTime = (workflow: CoreWorkflowMeta) => {
    if (workflow.status === 'finished' && workflow.end_time) {
      return intl.formatMessage({ id: 'workflows.endedAt' }, { time: format(workflow.end_time, lang) })
    }

    return workflow.created_at
      ? intl.formatMessage({ id: 'workflows.createdAt' }, { time: toRelative(workflow.created_at, lang) ?? '-' })
      : '-'
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
            <AccountTreeOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography component="h1" level="h2" sx={{ fontSize: 'xl' }}>
            {i18n('workflows.title', intl)}
          </Typography>
        </Box>

        <Button
          size="sm"
          color="primary"
          startDecorator={<AddIcon sx={compactIconSx} />}
          onClick={() => navigate('/workflows/new')}
        >
          <T id="newW.title" />
        </Button>
      </Box>

      <PanelCard sx={{ p: 0, gap: 0, minHeight: 360, overflow: 'hidden' }}>
        {isLoading ? (
          <Box sx={{ position: 'relative', minHeight: 360 }}>
            <LoadingOverlay contained />
          </Box>
        ) : workflows.length > 0 ? (
          <Box sx={{ maxHeight: 'calc(100dvh - 162px)', overflow: 'auto' }}>
            <Table
              size="sm"
              sx={{
                minWidth: 800,
                '--TableCell-paddingX': '0.875rem',
                '--Table-headerUnderlineThickness': '1px',
                '& tbody td': { paddingBlock: '0.75rem', verticalAlign: 'middle' },
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: 150 }}>{i18n('common.status', intl)}</th>
                  <th>{i18n('common.name', intl)}</th>
                  <th>{i18n('k8s.namespace', intl)}</th>
                  <th>{i18n('workflow.time', intl)}</th>
                  <th style={{ width: 120, paddingLeft: 20 }}>{i18n('common.operation', intl)}</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((workflow) => (
                  <tr key={workflow.uid ?? workflow.id}>
                    <td>
                      <StatusLabel status={workflow.status ?? 'unknown'} />
                    </td>
                    <td>
                      <Link
                        component="button"
                        level="title-sm"
                        underline="hover"
                        onClick={() => navigate(`/workflows/${workflow.uid}`)}
                      >
                        {workflow.name}
                      </Link>
                      <Typography level="body-xs" color="neutral" noWrap title={workflow.uid}>
                        {workflow.uid}
                      </Typography>
                    </td>
                    <td>{workflow.namespace}</td>
                    <td>
                      <Typography level="body-sm">{workflowTime(workflow)}</Typography>
                    </td>
                    <td>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {workflow.status === 'finished' && (
                          <IconButton
                            size="sm"
                            variant="plain"
                            color="primary"
                            title={i18n('workflows.rerun', intl)}
                            onClick={() => handleReRun(workflow.uid!)}
                          >
                            <ReplayIcon sx={compactIconSx} />
                          </IconButton>
                        )}
                        <IconButton
                          size="sm"
                          variant="plain"
                          color="neutral"
                          title={i18n('archives.single', intl)}
                          onClick={() => handleArchive(workflow)}
                        >
                          <ArchiveOutlinedIcon sx={compactIconSx} />
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        ) : (
          <NotFound illustrated sx={{ minHeight: 360, textAlign: 'center' }}>
            <Typography>{i18n('workflows.notFound', intl)}</Typography>
          </NotFound>
        )}
      </PanelCard>
    </>
  )
}
