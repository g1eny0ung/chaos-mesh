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
import { Submit } from '@/components/FormField'
import { ExperimentKind } from '@/components/NewExperiment/types'
import i18n from '@/components/T'
import { parseSubmit } from '@/lib/formikhelpers'
import Paper from '@/mui-extends/Paper'
import PaperTop from '@/mui-extends/PaperTop'
import { usePostExperiments } from '@/openapi'
import { setAlert } from '@/slices/globalStatus'
import { useStoreDispatch } from '@/store'
import useNewExperimentStore from '@/zustand/newExperiment'
import useSettingsStore from '@/zustand/settings'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { Box, Typography } from '@mui/material'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

interface Step3Props {
  onSubmit?: (parsedValues: any) => void
  inSchedule?: boolean
}

const Step3: React.FC<Step3Props> = ({ onSubmit, inSchedule }) => {
  const navigate = useNavigate()
  const intl = useIntl()

  const [step1, step2, env, kindAction, spec, basic, resetNewExperiment] = useNewExperimentStore((state) => [
    state.step1,
    state.step2,
    state.env,
    state.kindAction,
    state.spec,
    state.basic,
    state.resetNewExperiment,
  ])
  const [debugMode, useNewPhysicalMachine] = useSettingsStore((state) => [state.debugMode, state.useNewPhysicalMachine])
  const dispatch = useStoreDispatch()

  const { mutateAsync } = usePostExperiments()

  const submitExperiment = () => {
    const parsedValues = parseSubmit(
      env,
      kindAction[0] as ExperimentKind,
      {
        ...basic,
        spec: {
          ...basic.spec,
          ...spec,
        },
      },
      { inSchedule, useNewPhysicalMachine }
    )

    if (import.meta.env.DEV || debugMode) {
      console.debug('Debug parsedValues:', parsedValues)
    }

    if (!debugMode) {
      if (onSubmit) {
        onSubmit(parsedValues)
      } else {
        mutateAsync({
          data: parsedValues,
        })
          .then(() => {
            dispatch(
              setAlert({
                type: 'success',
                message: i18n('confirm.success.create', intl),
              })
            )

            resetNewExperiment()

            navigate('/experiments')
          })
          .catch(console.error)
      }
    }
  }

  return (
    <>
      {step1 && step2 && (
        <Paper>
          <PaperTop title={i18n('common.submit')} boxProps={{ mb: 6 }} />
          <Box textAlign="center">
            <DoneAllIcon fontSize="large" />
            <Typography>{i18n('newE.complete')}</Typography>
          </Box>
          <Submit onClick={submitExperiment} />
        </Paper>
      )}
    </>
  )
}

export default Step3
