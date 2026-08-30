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
import { FormControl, FormHelperText, FormLabel, Input, Textarea } from '@mui/joy'
import type { InputProps } from '@mui/joy'
import { FastField, Field } from 'formik'
import type { FieldProps, FieldValidator } from 'formik'
import type { WheelEvent } from 'react'

export type TextFieldProps = Omit<InputProps, 'color' | 'size' | 'slotProps'> & {
  label?: React.ReactNode
  helperText?: React.ReactNode
  error?: boolean
  multiline?: boolean
  rows?: number
  inputProps?: Record<string, unknown> &
    (React.InputHTMLAttributes<HTMLInputElement> | React.TextareaHTMLAttributes<HTMLTextAreaElement>)
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
  size?: InputProps['size'] | 'small' | 'medium'
  validate?: FieldValidator
  fast?: boolean
}

const preventScrollChangingNumberInput = (event: WheelEvent<HTMLInputElement>) => {
  event.currentTarget.blur()
}

const normalizeSize = (size: TextFieldProps['size']): InputProps['size'] => {
  if (size === 'small') {
    return 'sm'
  }

  if (size === 'medium') {
    return 'md'
  }

  return size ?? 'sm'
}

const TextField: ReactFCWithChildren<TextFieldProps> = ({
  fast = false,
  label,
  helperText,
  error = false,
  multiline = false,
  rows,
  inputProps,
  startAdornment,
  endAdornment,
  startDecorator,
  endDecorator,
  size,
  validate,
  name,
  fullWidth,
  ...rest
}) => {
  const FormikField = fast ? FastField : Field

  return (
    <FormikField name={name} validate={validate}>
      {({ field }: FieldProps) => (
        <FormControl disabled={rest.disabled} error={Boolean(error)} sx={fullWidth ? { width: '100%' } : undefined}>
          {label && <FormLabel>{label}</FormLabel>}
          {multiline ? (
            <Textarea
              {...(rest as any)}
              {...(field as any)}
              minRows={rows}
              maxRows={rows}
              size={normalizeSize(size)}
              startDecorator={startDecorator ?? startAdornment}
              endDecorator={endDecorator ?? endAdornment}
              slotProps={{ textarea: inputProps as any }}
            />
          ) : (
            <Input
              {...rest}
              {...field}
              fullWidth={fullWidth}
              size={normalizeSize(size)}
              startDecorator={startDecorator ?? startAdornment}
              endDecorator={endDecorator ?? endAdornment}
              slotProps={{
                input: {
                  ...inputProps,
                  onWheel:
                    rest.type === 'number'
                      ? preventScrollChangingNumberInput
                      : (inputProps as React.InputHTMLAttributes<HTMLInputElement> | undefined)?.onWheel,
                } as any,
              }}
            />
          )}
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      )}
    </FormikField>
  )
}

export default TextField
