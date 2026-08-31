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
import { templateTypeToFieldName } from '@/api/zz_generated.frontend.chaos-mesh'
import Space from '@/mui-extends/Space'
import type { TypesArchiveDetail, TypesExperimentDetail } from '@/openapi/index.schemas'
import { useSettingStore } from '@/zustand/setting'
import { useSystemStore } from '@/zustand/system'
import { Grid } from '@mui/joy'

import StatusLabel from '@/components/StatusLabel'
import i18n from '@/components/T'

import { format } from '@/lib/luxon'

import { Experiment, Selector, Table, TableBody, TableCell, TableRow, Typography } from './common'

type Config = TypesExperimentDetail | TypesArchiveDetail

interface ObjectConfigurationProps {
  config: Config
  inNode?: boolean
  inSchedule?: boolean
  inArchive?: boolean
  vertical?: boolean
  hideHeader?: boolean
}

const ObjectConfiguration: ReactFCWithChildren<ObjectConfigurationProps> = ({
  config,
  inNode,
  inSchedule,
  inArchive,
  vertical,
  hideHeader,
}) => {
  const lang = useSystemStore((state) => state.lang)
  const useNewPhysicalMachine = useSettingStore((state) => state.useNewPhysicalMachine)

  const spec: any = inNode ? config : config.kube_object?.spec
  const experiment =
    inSchedule || inNode ? spec[templateTypeToFieldName(inSchedule ? spec.type : (config as any).templateType)] : spec

  const hasAddress =
    !useNewPhysicalMachine &&
    (inNode
      ? (config as any).templateType === 'PhysicalMachineChaos'
      : inSchedule
        ? spec.type === 'PhysicalMachineChaos'
        : (config.kind as any) === 'PhysicalMachineChaos')

  return (
    <>
      {!inNode && !hideHeader && (
        <Space direction="row" sx={{ mb: 2 }}>
          <Typography>{config.name}</Typography>

          {!inArchive && <StatusLabel status={(config as any).status} />}
        </Space>
      )}

      <Grid container spacing={vertical ? 2 : 1.5}>
        {!inNode && (
          <Grid xs={12} md={vertical ? 12 : 6}>
            <Typography variant="subtitle2" gutterBottom>
              {i18n('newE.sections.basicInformation')}
            </Typography>

            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>{i18n('k8s.namespace')}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {config.namespace}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>{i18n('common.uuid')}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {config.uid}
                    </Typography>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>{i18n('table.created')}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {format(config.created_at!, lang)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        )}

        {(hasAddress || experiment?.selector) && (
          <Grid xs={12} md={vertical ? 12 : 6}>
            <Typography variant="subtitle2" gutterBottom>
              {i18n('newE.sections.targetScope')}
            </Typography>

            {experiment?.selector && <Selector data={experiment.selector} />}

            {hasAddress && (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>{i18n('physic.address')}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {inNode
                          ? (config as any).physicalmachineChaos.address
                          : inSchedule
                            ? spec.physicalmachineChaos.address
                            : spec.address}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </Grid>
        )}

        <Grid xs={12} md={vertical ? 12 : 6}>
          <Typography variant="subtitle2" gutterBottom>
            {i18n('experiments.single')}
          </Typography>

          <Experiment
            kind={inNode ? (config as any).templateType : inSchedule ? spec.type : config.kind}
            data={experiment}
          />
        </Grid>

        <Grid xs={12} md={vertical ? 12 : 6}>
          <Typography variant="subtitle2" gutterBottom>
            {i18n('newE.sections.runSettings')}
          </Typography>

          <Table size="small">
            <TableBody>
              {!inSchedule && (
                <TableRow>
                  <TableCell>{i18n(inNode ? 'newW.node.deadline' : 'common.duration')}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {inNode
                        ? (config as any).deadline
                        : spec.duration
                          ? spec.duration
                          : i18n('newE.run.continuousWithoutDuration')}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {inSchedule && (
                <>
                  <TableRow>
                    <TableCell>{i18n('schedules.single')}</TableCell>
                    <TableCell>
                      <Typography variant="body2" color="textSecondary">
                        {spec.schedule}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {spec.historyLimit && (
                    <TableRow>
                      <TableCell>{i18n('newS.basic.historyLimit')}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {spec.historyLimit}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {spec.concurrencyPolicy && (
                    <TableRow>
                      <TableCell>{i18n('newS.basic.concurrencyPolicy')}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {spec.concurrencyPolicy}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {spec.startingDeadlineSeconds && (
                    <TableRow>
                      <TableCell>{i18n('newS.basic.startingDeadlineSeconds')}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {spec.startingDeadlineSeconds}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </>
  )
}

export default ObjectConfiguration
