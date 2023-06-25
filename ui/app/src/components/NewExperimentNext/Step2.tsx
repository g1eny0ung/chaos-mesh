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
import CheckIcon from '@mui/icons-material/Check'
import PublishIcon from '@mui/icons-material/Publish'
import UndoIcon from '@mui/icons-material/Undo'
import { Box, Card, Chip, Divider, Grid, IconButton, Option, Typography } from '@mui/joy'
import { Stale } from 'api/queryUtils'
import { Form, Formik } from 'formik'
import _ from 'lodash'
import { useGetCommonChaosAvailableNamespaces } from 'openapi'
import { useEffect, useMemo, useState } from 'react'

import Space from '@ui/mui-extends/esm/Space'

import { useStoreDispatch, useStoreSelector } from 'store'

import { setBasic, setStep2 } from 'slices/experiments'

import { LabelField, SelectField, Submit, TextField } from 'components/FormField'
import MoreOptions from 'components/MoreOptions'
import { Fields as ScheduleSpecificFields, data as scheduleSpecificData } from 'components/Schedule/types'
import Scope from 'components/Scope'
import i18n from 'components/T'

import basicData, { schema as basicSchema } from './data/basic'
import Scheduler from './form/Scheduler'

interface Step2Props {
  inWorkflow?: boolean
  inSchedule?: boolean
}

const Step2: React.FC<Step2Props> = ({ inWorkflow = false, inSchedule = false }) => {
  const { step2, env, kindAction, basic } = useStoreSelector((state) => state.experiments)
  const [kind] = kindAction
  const scopeDisabled = kind === 'AWSChaos' || kind === 'GCPChaos'
  const schema = basicSchema({ env, scopeDisabled, scheduled: inSchedule, needDeadline: inWorkflow })
  const dispatch = useStoreDispatch()
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
    [inSchedule]
  )
  const [init, setInit] = useState(originalInit)

  const { data: namespaces } = useGetCommonChaosAvailableNamespaces({
    query: {
      enabled: false,
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

    if (process.env.NODE_ENV === 'development') {
      console.debug('Debug handleSubmitStep2:', values)
    }

    dispatch(setBasic(values))
    dispatch(setStep2(true))
  }

  const handleUndo = () => dispatch(setStep2(false))

  return (
    <Card
      variant="outlined"
      sx={{
        height: step2 ? 66 : 'auto',
        ...(step2 && { overflow: 'hidden' }),
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          {step2 && (
            <Chip size="sm" color="success" startDecorator={<CheckIcon />} sx={{ mr: 1 }}>
              Done
            </Chip>
          )}

          <Typography level="h2" fontSize="lg">
            {i18n(`${inSchedule ? 'newS' : 'newE'}.titleStep2`)}
          </Typography>
        </Box>

        {step2 && (
          <IconButton variant="outlined" size="sm" onClick={handleUndo}>
            <UndoIcon />
          </IconButton>
        )}
      </Box>
      <Box position="relative" hidden={step2}>
        <Formik
          enableReinitialize
          initialValues={init}
          validationSchema={schema}
          validateOnChange={false}
          onSubmit={handleOnSubmitStep2}
        >
          {({ errors, touched }) => (
            <Form>
              <Grid container spacing={6}>
                <Grid xs={6}>
                  <Space>
                    <Typography fontWeight={500}>{i18n('newE.steps.scope')}</Typography>
                    {namespaces ? (
                      <Scope env={env} kind={kind} namespaces={namespaces} scope="spec.selector" modeScope="spec" />
                    ) : (
                      // TODO: use skeleton
                      <div />
                    )}
                  </Space>
                </Grid>
                <Grid xs={6}>
                  <Space>
                    <Typography fontWeight={500}>{i18n('newE.steps.basic')}</Typography>
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
                          helperText={i18n('newE.basic.namespaceHelper')}
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
                  <Submit startDecorator={<PublishIcon />} />
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Card>
  )
}

export default Step2
