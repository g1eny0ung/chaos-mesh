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
import Space from '@/mui-extends/Space'
import { useExperimentActions } from '@/zustand/experiment'
import { Box, Tab, TabList, TabPanel, Tabs } from '@mui/joy'
import { forwardRef, useImperativeHandle, useState } from 'react'

import i18n from '@/components/T'

import { parseYAML } from '@/lib/formikhelpers'

import ByYAML from './ByYAML'
import LoadFrom from './LoadFrom'
import Step1 from './Step1'
import Step2 from './Step2'
import Step3 from './Step3'

type PanelType = 'initial' | 'existing' | 'yaml'

export interface NewExperimentHandles {
  setPanel: React.Dispatch<React.SetStateAction<PanelType>>
}

interface NewExperimentProps {
  onSubmit?: (parsedValues: any) => void
  loadFrom?: boolean
  inWorkflow?: boolean
  inSchedule?: boolean
}

const NewExperiment: React.ForwardRefRenderFunction<NewExperimentHandles, NewExperimentProps> = (
  { onSubmit, loadFrom = true, inWorkflow, inSchedule },
  ref,
) => {
  const { setExternalExp } = useExperimentActions()

  const [panel, setPanel] = useState<PanelType>('initial')

  useImperativeHandle(ref, () => ({
    setPanel,
  }))

  const onChange = (_event: React.SyntheticEvent | null, newValue: string | number | null) => {
    if (newValue) {
      setPanel(newValue as PanelType)
    }
  }

  const fillExperiment = (original: any) => {
    const { env, data } = parseYAML(original)
    const { kind, basic, spec } = data

    const action = spec.action ?? ''

    setExternalExp({
      env,
      kindAction: [kind, action],
      spec,
      basic,
    })

    setPanel('initial')
  }

  return (
    <Tabs value={panel} onChange={onChange}>
      {loadFrom && (
        <Box>
          <TabList variant="soft">
            <Tab value="initial">{i18n(inSchedule ? 'newS.title' : 'newE.create')}</Tab>
            <Tab value="existing">{i18n('newE.loadExistingExperiment')}</Tab>
            <Tab value="yaml">{i18n('newE.createFromYAML')}</Tab>
          </TabList>
        </Box>
      )}
      <TabPanel value="initial" sx={{ p: 0, pt: 3 }}>
        <Space spacing={3}>
          <Step1 />
          <Step2 inWorkflow={inWorkflow} inSchedule={inSchedule} />
          <Step3 onSubmit={onSubmit ? onSubmit : undefined} inSchedule={inSchedule} />
        </Space>
      </TabPanel>
      <TabPanel value="existing" sx={{ p: 0, pt: 3 }}>
        {loadFrom && <LoadFrom callback={fillExperiment} inSchedule={inSchedule} inWorkflow={inWorkflow} />}
      </TabPanel>
      <TabPanel value="yaml" sx={{ p: 0, pt: 3 }}>
        <ByYAML callback={fillExperiment} />
      </TabPanel>
    </Tabs>
  )
}

export default forwardRef(NewExperiment)
