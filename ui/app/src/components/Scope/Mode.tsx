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
import { SelectField, TextField } from '@/components/FormField'
import { T } from '@/components/T'
import { Option } from '@mui/joy'
import { getIn, useFormikContext } from 'formik'

const modes = [
  { name: 'Random One', value: 'one' },
  { name: 'Fixed Number', value: 'fixed' },
  { name: 'Fixed Percent', value: 'fixed-percent' },
  { name: 'Random Max Percent', value: 'random-max-percent' },
]
const modesWithAdornment = ['fixed-percent', 'random-max-percent']

interface ModeProps {
  modeScope: string
  scope: string
}

const Mode: React.FC<ModeProps> = ({ modeScope, scope }) => {
  const { values } = useFormikContext()

  return (
    <>
      <SelectField
        name={modeScope ? `${modeScope}.mode` : 'mode'}
        label={<T id="newE.scope.mode" />}
        helperText={<T id="newE.scope.modeHelper" />}
      >
        <Option value="all">All</Option>
        {modes.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.name}
          </Option>
        ))}
      </SelectField>

      {!['all', 'one'].includes(getIn(values, modeScope).mode) && (
        <TextField
          name={modeScope ? `${modeScope}.value` : 'value'}
          label={<T id="newE.scope.modeValue" />}
          helperText={<T id="newE.scope.modeValueHelper" />}
          endDecorator={modesWithAdornment.includes(getIn(values, scope).mode) && '%'}
        />
      )}
    </>
  )
}

export default Mode
