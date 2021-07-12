import { Box, Card, Divider, Typography } from '@material-ui/core'
import {
  Env,
  getNodes,
  setEnv,
  setKindAction as setKindActionToStore,
  setStep1,
  setTarget as setTargetToStore,
} from 'slices/experiments'
import _targetData, { Kind, Target, schema, dataPhysic as targetDataPhysic } from './data/target'
import { iconByKind, transByKind } from 'lib/byKind'
import { useEffect, useState } from 'react'
import { useStoreDispatch, useStoreSelector } from 'store'

import CheckIcon from '@material-ui/icons/Check'
import Kernel from './form/Kernel'
import Paper from 'components-mui/Paper'
import RadioButtonCheckedOutlinedIcon from '@material-ui/icons/RadioButtonCheckedOutlined'
import RadioButtonUncheckedOutlinedIcon from '@material-ui/icons/RadioButtonUncheckedOutlined'
import Stress from './form/Stress'
import T from 'components/T'
import TargetGenerated from './form/TargetGenerated'
import UndoIcon from '@material-ui/icons/Undo'
import _snakecase from 'lodash.snakecase'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => {
  const cardActive = {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  }

  return {
    card: {
      cursor: 'pointer',
      marginTop: theme.spacing(3),
      marginRight: theme.spacing(3),
      '&:hover': cardActive,
    },
    cardActive,
    submit: {
      borderColor: theme.palette.success.main,
    },
    submitIcon: {
      color: theme.palette.success.main,
    },
    asButton: {
      cursor: 'pointer',
    },
  }
})

const submitDirectly = ['pod-failure']

const Step1 = () => {
  const classes = useStyles()

  const state = useStoreSelector((state) => state)
  const { dnsServerCreate } = state.globalStatus
  const {
    env,
    kindAction: [_kind, _action],
    step1,
  } = state.experiments
  const dispatch = useStoreDispatch()

  const targetData = env === 'k8s' ? _targetData : targetDataPhysic
  let targetDataEntries = Object.entries(targetData) as [Kind, Target][]
  if (!dnsServerCreate) {
    targetDataEntries = targetDataEntries.filter((d) => d[0] !== 'DNSChaos')
  }
  const [kindAction, setKindAction] = useState<[Kind | '', string]>([_kind, _action])
  const [kind, action] = kindAction

  useEffect(() => {
    setKindAction([_kind, _action])
  }, [_kind, _action])

  const handleSelectTarget = (key: Kind) => () => setKindAction([key, ''])

  const handleSelectAction = (newAction: string) => () => {
    dispatch(setKindActionToStore([kind, newAction]))

    if (submitDirectly.includes(newAction)) {
      handleSubmitStep1({ action: newAction })
    }
  }

  const handleSubmitStep1 = (values: Record<string, any>) => {
    const result = {
      kind,
      [_snakecase(kind)]:
        submitDirectly.includes(values.action) && Object.keys(values).length === 1
          ? values
          : action
          ? {
              ...values,
              action,
            }
          : values,
    }

    if (process.env.NODE_ENV === 'development') {
      console.debug('Debug handleSubmitStep1', result)
    }

    dispatch(setTargetToStore(result))
    dispatch(setStep1(true))
  }

  const handleUndo = () => dispatch(setStep1(false))

  const handleSwitchEnv = (env: Env) => () => {
    setKindAction(['', ''])
    dispatch(setEnv(env))

    if (env === 'physic') {
      dispatch(getNodes())
    }
  }

  return (
    <Paper className={step1 ? classes.submit : ''}>
      <Box display="flex" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          {step1 && (
            <Box display="flex" mr={3}>
              <CheckIcon className={classes.submitIcon} />
            </Box>
          )}
          <Typography>{T('newE.titleStep0')}</Typography>
        </Box>
        {step1 && <UndoIcon className={classes.asButton} onClick={handleUndo} />}
      </Box>
      <Box hidden={step1}>
        <Box display="flex">
          <Card
            className={clsx(classes.card, env === 'k8s' ? classes.cardActive : '')}
            variant="outlined"
            onClick={handleSwitchEnv('k8s')}
          >
            <Box display="flex" justifyContent="center" alignItems="center" width={225} height={75}>
              <Box display="flex" justifyContent="center" flex={1}>
                {iconByKind('k8s')}
              </Box>
              <Box flex={1.5} textAlign="center">
                <Typography variant="button">{T('k8s.title')}</Typography>
              </Box>
            </Box>
          </Card>
          <Card
            className={clsx(classes.card, env === 'physic' ? classes.cardActive : '')}
            variant="outlined"
            onClick={handleSwitchEnv('physic')}
          >
            <Box display="flex" justifyContent="center" alignItems="center" width={225} height={75}>
              <Box display="flex" justifyContent="center" flex={1}>
                {iconByKind('physic')}
              </Box>
              <Box flex={1.5} textAlign="center">
                <Typography variant="button">{T('physic.title')}</Typography>
              </Box>
            </Box>
          </Card>
        </Box>
        <Divider sx={{ my: 6 }} />
      </Box>
      <Box hidden={step1}>
        <Typography>{T('newE.titleStep1')}</Typography>
        <Box display="flex" flexWrap="wrap">
          {targetDataEntries.map(([key]) => (
            <Card
              key={key}
              className={clsx(classes.card, kind === key ? classes.cardActive : '')}
              variant="outlined"
              onClick={handleSelectTarget(key)}
            >
              <Box display="flex" justifyContent="center" alignItems="center" width={225} height={75}>
                <Box display="flex" justifyContent="center" flex={1}>
                  {iconByKind(key)}
                </Box>
                <Box flex={1.5} textAlign="center">
                  <Typography variant="button">{transByKind(key)}</Typography>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>
        {kind && (
          <Box overflow="hidden">
            <Divider sx={{ mt: 6, mb: 3 }} />
            {(targetData as any)[kind].categories ? (
              <Box display="flex" flexWrap="wrap">
                {(targetData as any)[kind].categories!.map((d: any) => (
                  <Card
                    key={d.key}
                    className={clsx(classes.card, action === d.key ? classes.cardActive : '')}
                    variant="outlined"
                    onClick={handleSelectAction(d.key)}
                  >
                    <Box display="flex" justifyContent="center" alignItems="center" width={200} height={50}>
                      <Box display="flex" justifyContent="center" alignItems="center" flex={0.5}>
                        {action === d.key ? <RadioButtonCheckedOutlinedIcon /> : <RadioButtonUncheckedOutlinedIcon />}
                      </Box>
                      <Box flex={1.5} textAlign="center">
                        <Typography variant="button">{d.name}</Typography>
                      </Box>
                    </Box>
                  </Card>
                ))}
              </Box>
            ) : kind === 'KernelChaos' ? (
              <Box mt={6}>
                <Kernel onSubmit={handleSubmitStep1} />
              </Box>
            ) : kind === 'TimeChaos' ? (
              <Box mt={6}>
                <TargetGenerated
                  env={env}
                  data={(targetData as any)[kind].spec!}
                  validationSchema={schema.TimeChaos!.default}
                  onSubmit={handleSubmitStep1}
                />
              </Box>
            ) : kind === 'StressChaos' ? (
              <Box mt={6}>
                <Stress onSubmit={handleSubmitStep1} />
              </Box>
            ) : null}
          </Box>
        )}
        {action && !submitDirectly.includes(action) && (
          <>
            <Divider sx={{ my: 6 }} />
            <TargetGenerated
              // Force re-rendered after action changed
              key={kind + action}
              env={env}
              kind={kind}
              data={(targetData as any)[kind as Kind].categories!.find(({ key }: any) => key === action).spec}
              validationSchema={env === 'k8s' ? schema[kind as Kind]![action] : undefined}
              onSubmit={handleSubmitStep1}
            />
          </>
        )}
      </Box>
    </Paper>
  )
}

export default Step1
