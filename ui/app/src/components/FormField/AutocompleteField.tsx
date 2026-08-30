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
import { Autocomplete, Chip, ChipDelete, FormControl, FormHelperText, FormLabel } from '@mui/joy'
import type { AutocompleteProps } from '@mui/joy'
import { getIn, useFormikContext } from 'formik'

import { T } from '@/components/T'

export interface AutocompleteFieldProps extends Omit<
  AutocompleteProps<string, true, boolean, boolean>,
  'color' | 'multiple' | 'onChange' | 'renderTags' | 'size' | 'value'
> {
  name: string
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
  fullWidth?: boolean
  multiple?: true
  size?: AutocompleteProps<string, true, boolean, boolean>['size'] | 'small' | 'medium'
}

const normalizeSize = (
  size: AutocompleteFieldProps['size'],
): AutocompleteProps<string, true, boolean, boolean>['size'] => {
  if (size === 'small') {
    return 'sm'
  }

  if (size === 'medium') {
    return 'md'
  }

  return size ?? 'sm'
}

const AutocompleteField: ReactFCWithChildren<AutocompleteFieldProps> = ({
  name,
  label,
  helperText,
  error = false,
  fullWidth,
  options,
  disabled,
  size,
  sx,
  ...props
}) => {
  const { values, setFieldTouched, setFieldValue } = useFormikContext<Record<string, unknown>>()
  const value = (getIn(values, name) || []) as string[]

  const removeValue = (item: string) =>
    setFieldValue(
      name,
      value.filter((valueItem) => valueItem !== item),
    )

  return (
    <FormControl disabled={disabled} error={Boolean(error)} sx={fullWidth ? { width: '100%' } : undefined}>
      {label && <FormLabel>{label}</FormLabel>}
      <Autocomplete
        {...props}
        name={name}
        multiple
        disabled={disabled}
        options={!disabled ? options : []}
        noOptionsText={<T id="common.noOptions" />}
        value={value}
        size={normalizeSize(size)}
        sx={sx}
        onBlur={() => setFieldTouched(name, true)}
        onChange={(_event, newValue) => setFieldValue(name, newValue)}
        renderTags={(selected, getTagProps) =>
          selected.map((item, index) => {
            const tagProps = getTagProps({ index })

            return (
              <Chip
                key={tagProps.key}
                color="primary"
                size="sm"
                endDecorator={<ChipDelete onDelete={() => removeValue(item)} />}
              >
                {item}
              </Chip>
            )
          })
        }
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default AutocompleteField
