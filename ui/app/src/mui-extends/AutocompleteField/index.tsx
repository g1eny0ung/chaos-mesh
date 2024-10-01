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
import { Autocomplete } from '@mui/joy'
import type { AutocompleteProps } from '@mui/joy'

import FormControl from '../FormControl'

export interface AutocompleteFieldProps<
  T = string,
  Multiple extends boolean | undefined = boolean,
  DisableClearable extends boolean | undefined = boolean,
  FreeSolo extends boolean | undefined = boolean
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name?: string
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
}

export default function AutocompleteField<T>({
  name,
  label,
  helperText,
  disabled,
  error,
  ...props
}: AutocompleteFieldProps<T>) {
  return (
    <FormControl disabled={disabled} error={error} label={label} LabelProps={{ htmlFor: name }} helperText={helperText}>
      <Autocomplete id={name} {...props} />
    </FormControl>
  )
}
