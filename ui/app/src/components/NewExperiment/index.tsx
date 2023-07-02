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
import i18n from '@/components/T'
import { parseYAML } from '@/lib/formikhelpers'
import useNewExperimentStore from '@/zustand/newExperiment'
import Tab from '@mui/joy/Tab'
import TabList from '@mui/joy/TabList'
import TabPanel from '@mui/joy/TabPanel'
import Tabs from '@mui/joy/Tabs'
import { forwardRef, useImperativeHandle, useState } from 'react'

import Space from '@ui/mui-extends/esm/Space'

import ByYAML from './ByYAML'
import LoadFrom from './LoadFrom'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

export interface NewExperimentHandles {
  setPanel: React.Dispatch<React.SetStateAction<number>>
}

interface NewExperimentProps {
  onSubmit?: (parsedValues: any) => void
  loadFrom?: boolean
  inWorkflow?: boolean
  inSchedule?: boolean
}

const NewExperiment: React.ForwardRefRenderFunction<NewExperimentHandles, NewExperimentProps> = (
  { onSubmit, loadFrom = true, inWorkflow, inSchedule },
  ref
) => {
  const [setEnv, setExternalExperiment] = useNewExperimentStore((state) => [state.setEnv, state.setExternalExperiment])

  const [panel, setPanel] = useState(0)

  useImperativeHandle(ref, () => ({
    setPanel,
  }))

  const fillExperiment = (original: any) => {
    const { kind, basic, spec } = parseYAML(original)
    const env = kind === 'PhysicalMachineChaos' ? 'physic' : 'k8s'
    const action = spec.action ?? ''

    setEnv(env)
    setExternalExperiment({
      kindAction: [kind, action],
      spec,
      basic,
    })

    setPanel(0)
  }

  return (
    <Tabs value={panel}>
      {loadFrom && (
        <TabList sx={{ mb: 3 }}>
          <Tab>{i18n('newE.byStep')}</Tab>
          <Tab>{i18n('newE.loadFrom')}</Tab>
          <Tab>{i18n('newE.byYAML')}</Tab>
        </TabList>
      )}
      <TabPanel value={0}>
        <Space>
          <Step1 />
          <Step2 inWorkflow={inWorkflow} inSchedule={inSchedule} />
          <Step3 onSubmit={onSubmit ? onSubmit : undefined} inSchedule={inSchedule} />
        </Space>
      </TabPanel>
      <TabPanel value={1}>
        {loadFrom && <LoadFrom callback={fillExperiment} inSchedule={inSchedule} inWorkflow={inWorkflow} />}
      </TabPanel>
      <TabPanel value={2}>
        <ByYAML callback={fillExperiment} />
      </TabPanel>
    </Tabs>
  )
}

export default forwardRef(NewExperiment)
