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
import { Stale } from '@/api/queryUtils'
import SkeletonN from '@/mui-extends/SkeletonN'
import Space from '@/mui-extends/Space'
import { useGetCommonChaosAvailableNamespaces } from '@/openapi'
import { useExperimentActions, useExperimentStore } from '@/zustand/experiment'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Box, Button, Divider, Grid, Option, Typography } from '@mui/joy'
import { Form, Formik } from 'formik'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'

import { LabelField, SelectField, TextField } from '@/components/FormField'
import MoreOptions from '@/components/MoreOptions'
import PanelCard from '@/components/PanelCard'
import { Fields as ScheduleSpecificFields, data as scheduleSpecificData } from '@/components/Schedule/types'
import Scope from '@/components/Scope'
import i18n from '@/components/T'

import basicData, { schema as basicSchema } from './data/basic'
import Scheduler from './form/Scheduler'

interface Step2Props {
  inWorkflow?: boolean
  inSchedule?: boolean
}

const Step2: ReactFCWithChildren<Step2Props> = ({ inWorkflow = false, inSchedule = false }) => {
  const {
    step2,
    env,
    kindAction: [kind],
    basic,
  } = useExperimentStore()
  const { setBasic, setStep2 } = useExperimentActions()
  const scopeDisabled = kind === 'AWSChaos' || kind === 'GCPChaos'
  const schema = basicSchema({ env, scopeDisabled, scheduled: inSchedule, needDeadline: inWorkflow })
  const originalInit = useMemo(
    () =>
      inSchedule
        ? {
            metadata: basicData.metadata,
            spec: {
              ...basicData.spec,
              ...scheduleSpecificData,
            },
          }
        : basicData,
    [inSchedule],
  )
  const [init, setInit] = useState(originalInit)

  const { data: namespaces } = useGetCommonChaosAvailableNamespaces({
    query: {
      staleTime: Stale.DAY,
    },
  })

  useEffect(() => {
    if (!_.isEmpty(basic)) {
      setInit({
        metadata: {
          ...originalInit.metadata,
          ...basic.metadata,
        },
        spec: {
          ...originalInit.spec,
          ...basic.spec,
          selector: {
            ...originalInit.spec.selector,
            ...basic.spec.selector,
          },
        },
      })
    }
  }, [originalInit, basic])

  const handleOnSubmitStep2 = (_values: Record<string, any>) => {
    const values = schema.cast(_values) as Record<string, any>

    if (import.meta.env.DEV) {
      console.info('Debug handleSubmitStep2:', values)
    }

    setBasic(values)
    setStep2(true)
  }

  const handleEdit = () => setStep2(false)

  return (
    <PanelCard sx={{ p: step2 ? 1.5 : undefined }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: step2 ? 0 : 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {step2 && <CheckCircleRoundedIcon sx={{ color: 'var(--joy-palette-success-500)' }} />}
          <Typography level="title-md" component="div">
            {i18n(inSchedule ? 'newS.titleStep2' : 'newE.sections.configuration')}
          </Typography>
        </Box>
        {step2 && (
          <Button
            size="sm"
            variant="plain"
            color="neutral"
            startDecorator={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={handleEdit}
          >
            {i18n('common.edit')}
          </Button>
        )}
      </Box>
      <Box
        hidden={step2}
        sx={{
          position: 'relative',
        }}
      >
        <Formik
          enableReinitialize
          initialValues={init}
          validationSchema={schema}
          validateOnChange={false}
          onSubmit={handleOnSubmitStep2}
        >
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Space>
                    <Typography
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      {i18n('newE.sections.targetScope')}
                    </Typography>
                    {namespaces ? (
                      <Scope env={env} kind={kind} namespaces={namespaces} scope="spec.selector" modeScope="spec" />
                    ) : (
                      <SkeletonN n={6} />
                    )}
                  </Space>
                </Grid>
                <Grid xs={12} md={6}>
                  <Space>
                    <Typography
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      {i18n('newE.sections.basicInformation')}
                    </Typography>
                    <TextField
                      fast
                      name="metadata.name"
                      label={i18n('common.name')}
                      helperText={
                        errors.metadata?.name && touched.metadata?.name
                          ? errors.metadata.name
                          : i18n(`${inSchedule ? 'newS' : 'newE'}.basic.nameHelper`)
                      }
                      error={errors.metadata?.name && touched.metadata?.name ? true : false}
                    />
                    {inWorkflow && (
                      <TextField
                        fast
                        name="spec.duration"
                        label={i18n('newW.node.deadline')}
                        helperText={
                          errors.spec?.duration && touched.spec?.duration
                            ? errors.spec?.duration
                            : i18n('newW.node.deadlineHelper')
                        }
                        error={errors.spec?.duration && touched.spec?.duration ? true : false}
                      />
                    )}
                    {inSchedule && <ScheduleSpecificFields errors={errors} touched={touched} />}
                    <MoreOptions>
                      {namespaces && (
                        <SelectField
                          name="metadata.namespace"
                          label={i18n('k8s.namespace')}
                          helperText={i18n('newE.basic.resourceNamespaceHelper')}
                        >
                          {namespaces.map((n) => (
                            <Option key={n} value={n}>
                              {n}
                            </Option>
                          ))}
                        </SelectField>
                      )}
                      <LabelField
                        name="metadata.labels"
                        label={i18n('k8s.labels')}
                        helperText={i18n('common.isKVHelperText')}
                      />
                      <LabelField
                        name="metadata.annotations"
                        label={i18n('k8s.annotations')}
                        helperText={i18n('common.isKVHelperText')}
                      />
                    </MoreOptions>
                    {!inWorkflow && (
                      <>
                        <Divider />
                        <Scheduler errors={errors} touched={touched} inSchedule={inSchedule} />
                      </>
                    )}
                  </Space>
                  <Box
                    sx={{
                      mt: 6,
                      textAlign: 'right',
                    }}
                  >
                    <Button type="submit" variant="solid" color="primary">
                      {i18n('common.submit')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </PanelCard>
  )
}

export default Step2
