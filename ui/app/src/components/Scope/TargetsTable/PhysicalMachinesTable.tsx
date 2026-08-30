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
import type { TypesPhysicalMachine } from '@/openapi/index.schemas'
import { Checkbox, Sheet, Table } from '@mui/joy'

import { T } from '@/components/T'

import { TargetsTableActions } from '.'

interface PhysicalMachinesTableProps extends TargetsTableActions {
  data: TypesPhysicalMachine[]
}

export default function PhysicalMachinesTable({ data, handleSelect, isSelected }: PhysicalMachinesTableProps) {
  return (
    <Sheet variant="outlined" sx={{ maxHeight: 768, overflow: 'auto', borderRadius: 'sm' }}>
      <Table hoverRow stickyHeader size="sm">
        <thead>
          <tr>
            <th style={{ width: 40 }} />
            <th>
              <T id="common.name" />
            </th>
            <th>
              <T id="k8s.namespace" />
            </th>
            <th>
              <T id="physic.address" />
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((machine) => {
            const key = `${machine.namespace}:${machine.name}`

            return (
              <tr key={key} onClick={handleSelect(key)} style={{ cursor: 'pointer' }}>
                <td>
                  <Checkbox
                    checked={isSelected(key)}
                    readOnly
                    color="primary"
                    slotProps={{ input: { 'aria-label': `Select ${machine.name}` } }}
                  />
                </td>
                <td>{machine.name}</td>
                <td>{machine.namespace}</td>
                <td>{machine.address}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </Sheet>
  )
}
