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
import { useGetCommonConfig } from '@/openapi'
import { Env, useExperimentActions, useExperimentStore } from '@/zustand/experiment'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined'
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined'
import { Box, Button, Card, Divider, Grid, Typography } from '@mui/joy'

import PanelCard from '@/components/PanelCard'
import i18n from '@/components/T'

import { iconByKind, transByKind } from '@/lib/byKind'

import _typesData, { Definition, Kind, dataPhysic, schema } from './data/types'
import Kernel from './form/Kernel'
import Stress from './form/Stress'
import TargetGenerated from './form/TargetGenerated'

const cardSx = (active: boolean, minHeight = 64) => ({
  cursor: 'pointer',
  width: '100%',
  minWidth: 0,
  minHeight,
  height: '100%',
  p: 1.5,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 1.5,
  font: 'inherit',
  textAlign: 'left',
  ...(active && {
    color: 'primary.500',
    borderColor: 'primary.outlinedBorder',
    bgcolor: 'primary.softBg',
  }),
  '&:hover': {
    color: 'primary.500',
    borderColor: 'primary.outlinedBorder',
    bgcolor: 'primary.softHoverBg',
  },
})

const iconSx = (active: boolean) => ({
  display: 'grid',
  placeItems: 'center',
  flex: '0 0 auto',
  width: 36,
  height: 36,
  borderRadius: 'sm',
  color: active ? 'primary.softColor' : 'neutral.600',
  bgcolor: active ? 'primary.softHoverBg' : 'neutral.softBg',
  '& svg': {
    fontSize: 'xl2',
  },
})

interface TypeCardProp {
  name: Env
  handleSwitchEnv: (env: Env) => () => void
  env: Env
}

const TypeCard: ReactFCWithChildren<TypeCardProp> = ({ name, handleSwitchEnv, env }) => {
  const title = name === 'k8s' ? 'k8s.title' : 'physics.single'
  const active = env === name

  return (
    <Card
      component="button"
      type="button"
      aria-pressed={active}
      variant="outlined"
      sx={cardSx(active)}
      onClick={handleSwitchEnv(name)}
    >
      <Box sx={iconSx(active)}>{iconByKind(name)}</Box>
      <Typography level="title-sm">{i18n(title)}</Typography>
    </Card>
  )
}

const Step1 = () => {
  const {
    env,
    kindAction: [kind, action],
    step1,
  } = useExperimentStore()
  const { setEnv, setKindAction, setSpec, setStep1 } = useExperimentActions()

  const { data: config } = useGetCommonConfig({
    query: {
      enabled: false,
      staleTime: Stale.DAY,
    },
  })

  const typesData = env === 'k8s' ? _typesData : dataPhysic
  let typesDataEntries = Object.entries(typesData) as [Kind, Definition][]
  if (!config?.dns_server_create) {
    typesDataEntries = typesDataEntries.filter((d) => d[0] !== 'DNSChaos')
  }

  const handleSelectTarget = (key: Kind) => () => {
    setKindAction([key, ''])
  }

  const handleSelectAction = (newAction: string) => () => {
    setKindAction([kind, newAction])
  }

  const handleSubmitStep1 = (values: Record<string, any>) => {
    const result = action
      ? {
          ...values,
          action,
        }
      : values

    if (import.meta.env.DEV) {
      console.info('Debug handleSubmitStep1:', result)
    }

    setSpec(result)
    setStep1(true)
  }

  const handleEdit = () => setStep1(false)

  const handleSwitchEnv = (env: Env) => () => {
    setKindAction(['', ''])
    setEnv(env)
  }

  return (
    <PanelCard sx={{ p: step1 ? 1.5 : undefined }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: step1 ? 0 : 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {step1 && <CheckCircleRoundedIcon sx={{ color: 'var(--joy-palette-success-500)' }} />}
          <Typography level="title-md" component="div">
            {i18n('newE.sections.injectionTarget')}
          </Typography>
        </Box>
        {step1 && (
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
      <Box hidden={step1}>
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={4} xl={3}>
            <TypeCard name="k8s" handleSwitchEnv={handleSwitchEnv} env={env} />
          </Grid>
          <Grid xs={12} sm={6} md={4} xl={3}>
            <TypeCard name="physic" handleSwitchEnv={handleSwitchEnv} env={env} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
      </Box>
      <Box hidden={step1}>
        <Grid container spacing={3}>
          {typesDataEntries.map(([key]) => (
            <Grid key={key} xs={12} sm={6} md={4} xl={3}>
              <Card
                component="button"
                type="button"
                aria-pressed={kind === key}
                variant="outlined"
                sx={cardSx(kind === key)}
                onClick={handleSelectTarget(key)}
              >
                <Box sx={iconSx(kind === key)}>{iconByKind(key)}</Box>
                <Typography level="title-sm">{transByKind(key)}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
        {kind && (
          <Box
            sx={{
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                mt: 4,
                mb: 3,
              }}
            >
              <Divider />
            </Box>
            {(typesData as any)[kind].categories ? (
              <Grid container spacing={3}>
                {(typesData as any)[kind].categories!.map((d: any) => (
                  <Grid key={d.key} xs={12} sm={6} md={4} xl={3}>
                    <Card
                      component="button"
                      type="button"
                      aria-pressed={action === d.key}
                      variant="outlined"
                      sx={cardSx(action === d.key, 52)}
                      onClick={handleSelectAction(d.key)}
                    >
                      <Box sx={{ display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>
                        {action === d.key ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />}
                      </Box>
                      <Typography level="title-sm">{d.name}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : kind === 'KernelChaos' ? (
              <Box
                sx={{
                  mt: 6,
                }}
              >
                <Kernel onSubmit={handleSubmitStep1} />
              </Box>
            ) : kind === 'TimeChaos' ? (
              <Box
                sx={{
                  mt: 6,
                }}
              >
                <TargetGenerated
                  env={env}
                  kind={kind}
                  data={(typesData as any)[kind].spec!}
                  validationSchema={env === 'k8s' ? schema.TimeChaos!.default : undefined}
                  onSubmit={handleSubmitStep1}
                />
              </Box>
            ) : kind === 'StressChaos' ? (
              <Box
                sx={{
                  mt: 6,
                }}
              >
                <Stress onSubmit={handleSubmitStep1} />
              </Box>
            ) : (kind as any) === 'ProcessChaos' ? (
              <Box
                sx={{
                  mt: 6,
                }}
              >
                <TargetGenerated
                  env={env}
                  kind={kind}
                  data={(typesData as any)[kind].spec!}
                  onSubmit={handleSubmitStep1}
                />
              </Box>
            ) : null}
          </Box>
        )}
        {action && (
          <>
            <Divider sx={{ my: 4 }} />
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
      </Box>
    </PanelCard>
  )
}

export default Step1
