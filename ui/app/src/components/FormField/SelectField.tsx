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
import { Chip, ChipDelete, FormControl, FormHelperText, FormLabel, Option, Select } from '@mui/joy'
import type { SelectProps } from '@mui/joy'
import type { SelectOption } from '@mui/joy/Select'
import { getIn, useFormikContext } from 'formik'
import { Children, isValidElement } from 'react'

export type SelectFieldProps<T = string> = Omit<
  SelectProps<any, boolean>,
  'color' | 'defaultValue' | 'multiple' | 'name' | 'onChange' | 'renderValue' | 'size' | 'value'
> & {
  name: string
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
  fullWidth?: boolean
  multiple?: boolean
  defaultValue?: T
  size?: SelectProps<any, boolean>['size'] | 'small' | 'medium'
}

const normalizeSize = (size: SelectFieldProps['size']): SelectProps<any, boolean>['size'] => {
  if (size === 'small') {
    return 'sm'
  }

  if (size === 'medium') {
    return 'md'
  }

  return size ?? 'sm'
}

function SelectField<T>({
  name,
  label,
  helperText,
  error = false,
  fullWidth,
  multiple = false,
  defaultValue,
  children,
  size,
  sx,
  ...rest
}: SelectFieldProps<T>) {
  const { values, setFieldTouched, setFieldValue } = useFormikContext<Record<string, unknown>>()
  const currentValue = getIn(values, name) ?? (multiple ? [] : (defaultValue ?? null))

  const options = Children.map(children, (child) => {
    if (!isValidElement<{ children?: React.ReactNode; disabled?: boolean; value?: unknown }>(child)) {
      return child
    }

    return (
      <Option key={child.key} value={child.props.value as any} disabled={child.props.disabled}>
        {child.props.children}
      </Option>
    )
  })

  const removeValue = (value: unknown) =>
    setFieldValue(
      name,
      (currentValue as unknown[]).filter((item) => item !== value),
    )

  return (
    <FormControl disabled={rest.disabled} error={Boolean(error)} sx={fullWidth ? { width: '100%' } : undefined}>
      {label && <FormLabel>{label}</FormLabel>}
      <Select
        {...rest}
        name={name}
        value={currentValue as any}
        multiple={multiple}
        size={normalizeSize(size)}
        sx={sx}
        onBlur={() => setFieldTouched(name, true)}
        onChange={(_event, value) => setFieldValue(name, value)}
        renderValue={
          multiple
            ? (selected) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {(selected as SelectOption<any>[]).map((option) => (
                    <Chip
                      key={String(option.value)}
                      color="primary"
                      size="sm"
                      endDecorator={
                        <ChipDelete
                          onMouseDown={(event) => event.stopPropagation()}
                          onDelete={(event) => {
                            event.stopPropagation()
                            removeValue(option.value)
                          }}
                        />
                      }
                    >
                      {option.label}
                    </Chip>
                  ))}
                </div>
              )
            : undefined
        }
      >
        {options}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export default SelectField
