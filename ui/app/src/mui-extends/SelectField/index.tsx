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
import { Select } from '@mui/joy'
import type { SelectProps } from '@mui/joy'

import FormControl from '../FormControl'

export type SelectFieldProps<T extends {}> = SelectProps<T> & {
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
}

export default function SelectField<T extends {}>({ label, helperText, ...props }: SelectFieldProps<T>) {
  const { disabled, error } = props
  if (error) {
    props.color = 'danger'
  }

  return (
    <FormControl disabled={disabled} label={label} helperText={helperText}>
      <Select {...props} />
    </FormControl>
  )
}
