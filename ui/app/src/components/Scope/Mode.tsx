/*
 * Copyright 2022 Chaos Mesh Authors.
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
import { Option, Typography } from '@mui/joy'
import { getIn, useFormikContext } from 'formik'

import { SelectField, TextField } from '@/components/FormField'
import { T } from '@/components/T'

const modes = [
  { name: 'Random One', value: 'one' },
  { name: 'Fixed Number', value: 'fixed' },
  { name: 'Fixed Percent', value: 'fixed-percent' },
  { name: 'Random Max Percent', value: 'random-max-percent' },
]
const modesWithAdornment = ['fixed-percent', 'random-max-percent']

interface ModeProps {
  modeScope: string
  scope?: string
}

const Mode: ReactFCWithChildren<ModeProps> = ({ modeScope }) => {
  const { values } = useFormikContext()
  const modePath = modeScope ? `${modeScope}.mode` : 'mode'
  const valuePath = modeScope ? `${modeScope}.value` : 'value'
  const mode = getIn(values, modePath)

  return (
    <>
      <SelectField
        name={modePath}
        label={<T id="newE.scope.injectionMode" />}
        helperText={<T id="newE.scope.injectionModeHelper" />}
      >
        <Option value="all">All</Option>
        {modes.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.name}
          </Option>
        ))}
      </SelectField>

      {!['all', 'one'].includes(mode) && (
        <TextField
          name={valuePath}
          label={<T id="newE.scope.countOrPercentage" />}
          helperText={<T id="newE.scope.countOrPercentageHelper" />}
          endDecorator={modesWithAdornment.includes(mode) && <Typography level="body-sm">%</Typography>}
        />
      )}
    </>
  )
}

export default Mode
