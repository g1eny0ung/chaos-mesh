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
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined'
import UndoIcon from '@mui/icons-material/Undo'
import { Box, Card, Chip, Divider, Grid, ListItemDecorator, Option, Select, SelectOption, Typography } from '@mui/joy'
import { Stale } from 'api/queryUtils'
import { useGetCommonConfig } from 'openapi'

import { useStoreDispatch, useStoreSelector } from 'store'

import { Env, setEnv, setKindAction, setSpec, setStep1 } from 'slices/experiments'

import i18n, { T } from 'components/T'

import { iconByKind, transByKind } from 'lib/byKind'

import _typesData, { Definition, Kind, dataPhysic, schema } from './data/types'
import Kernel from './form/Kernel'
import Stress from './form/Stress'
import TargetGenerated from './form/TargetGenerated'

const submitDirectly = ['pod-failure']

function renderEnv(option: SelectOption<Env> | null) {
  if (!option) {
    return null
  }

  return (
    <>
      <ListItemDecorator sx={{ mr: 1.5 }}>{iconByKind(option.value, 'inherit')}</ListItemDecorator>
      {option.label}
    </>
  )
}

const Step1 = () => {
  const state = useStoreSelector((state) => state)
  const {
    env,
    kindAction: [kind, action],
    step1,
  } = state.experiments
  const dispatch = useStoreDispatch()

  const { data: config } = useGetCommonConfig({
    query: {
      enabled: false,
      staleTime: Stale.DAY,
    },
  })

  const envOptions = [
    { label: i18n('k8s.title'), value: 'k8s' as Env },
    { label: i18n('physics.single'), value: 'physic' as Env },
  ]

  const typesData = env === 'k8s' ? _typesData : dataPhysic
  let typesDataEntries = Object.entries(typesData) as [Kind, Definition][]
  if (!config?.dns_server_create) {
    typesDataEntries = typesDataEntries.filter((d) => d[0] !== 'DNSChaos')
  }

  const handleSelectTarget = (key: Kind) => () => {
    dispatch(setKindAction([key, '']))
  }

  const handleSelectAction = (newAction: string) => () => {
    dispatch(setKindAction([kind, newAction]))

    if (submitDirectly.includes(newAction)) {
      handleSubmitStep1({ action: newAction })
    }
  }

  const handleSubmitStep1 = (values: Record<string, any>) => {
    const result = action
      ? {
          ...values,
          action,
        }
      : values

    if (process.env.NODE_ENV === 'development') {
      console.debug('Debug handleSubmitStep1:', result)
    }

    dispatch(setSpec(result))
    dispatch(setStep1(true))
  }

  const handleUndo = () => dispatch(setStep1(false))

  const handleSwitchEnv = (_: React.SyntheticEvent | null, env: Env | null) => () => {
    dispatch(setKindAction(['', '']))
    dispatch(setEnv(env!))
  }

  return (
    <Card variant="outlined" className={step1 ? 'submit' : ''}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          {step1 && (
            <Chip size="sm" color="success" startDecorator={<CheckIcon />} sx={{ mr: 1 }}>
              Done
            </Chip>
          )}

          <Typography level="h2" fontSize="lg">
            {i18n('newE.titleStep1')}
          </Typography>
        </Box>

        {step1 ? (
          <UndoIcon onClick={handleUndo} />
        ) : (
          <Select defaultValue="k8s" size="sm" renderValue={renderEnv} sx={{ width: 150 }} onChange={handleSwitchEnv}>
            {envOptions.map((option) => (
              <Option key={option.value} value={option.value} label={option.label}>
                <ListItemDecorator>{iconByKind(option.value, 'inherit')}</ListItemDecorator>
                {option.label}
              </Option>
            ))}
          </Select>
        )}
      </Box>
      <Grid container spacing={3}>
        {typesDataEntries.map(([key]) => (
          <Grid key={key} xs={12} sm={3}>
            <Card
              variant="outlined"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'primary.softBg',
                  color: 'primary.softColor',
                  borderColor: 'primary.outlinedBorder',
                },
                ...(key === kind && {
                  bgcolor: 'primary.softBg',
                  color: 'primary.softColor',
                  borderColor: 'primary.outlinedBorder',
                }),
              }}
              onClick={handleSelectTarget(key)}
            >
              <Box display="flex" alignItems="center">
                <Box display="flex" mr={3}>
                  {iconByKind(key)}
                </Box>
                <Typography level="body2" sx={{ color: 'inherit' }}>
                  {transByKind(key)}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ mt: 3 }} />

      {kind ? (
        <Box overflow="hidden">
          {(typesData as any)[kind].categories ? (
            <>
              <Typography level="h2" fontSize="md" sx={{ mb: 3 }}>
                <T id="newE.step1Actions" />
              </Typography>
              <Grid container spacing={3}>
                {(typesData as any)[kind].categories!.map((d: any) => (
                  <Grid key={d.key} xs={12} sm={3}>
                    <Card
                      variant="outlined"
                      size="sm"
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'primary.softBg',
                          color: 'primary.softColor',
                          borderColor: 'primary.outlinedBorder',
                        },
                        ...(d.key === action && {
                          bgcolor: 'primary.softBg',
                          color: 'primary.softColor',
                          borderColor: 'primary.outlinedBorder',
                        }),
                      }}
                      onClick={handleSelectAction(d.key)}
                    >
                      <Box display="flex" alignItems="center">
                        <Box display="flex" ml={1} mr={3}>
                          {d.key === action ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />}
                        </Box>
                        <Typography level="body2" sx={{ color: 'inherit' }}>
                          {d.name}
                        </Typography>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : kind === 'KernelChaos' ? (
            <Box mt={6}>
              <Kernel onSubmit={handleSubmitStep1} />
            </Box>
          ) : kind === 'TimeChaos' ? (
            <Box mt={6}>
              <TargetGenerated
                env={env}
                kind={kind}
                data={(typesData as any)[kind].spec!}
                validationSchema={env === 'k8s' ? schema.TimeChaos!.default : undefined}
                onSubmit={handleSubmitStep1}
              />
            </Box>
          ) : kind === 'StressChaos' ? (
            <Box mt={6}>
              <Stress onSubmit={handleSubmitStep1} />
            </Box>
          ) : (kind as any) === 'ProcessChaos' ? (
            <Box mt={6}>
              <TargetGenerated
                env={env}
                kind={kind}
                data={(typesData as any)[kind].spec!}
                onSubmit={handleSubmitStep1}
              />
            </Box>
          ) : null}
        </Box>
      ) : (
        <Box my={3} textAlign="center">
          <Typography color="neutral">
            <T id="newE.step1Tip" />
          </Typography>
        </Box>
      )}

      {action && !submitDirectly.includes(action) && (
        <>
          <Divider sx={{ my: 3 }} />
          <TargetGenerated
            // Force re-rendered after action changed
            key={kind + action}
            env={env}
            kind={kind}
            data={(typesData as any)[kind as Kind].categories!.filter(({ key }: any) => key === action)[0].spec}
            validationSchema={
              env === 'k8s' ? (schema[kind as Kind] ? schema[kind as Kind]![action] : undefined) : undefined
            }
            onSubmit={handleSubmitStep1}
          />
        </>
      )}
    </Card>
  )
}

export default Step1
