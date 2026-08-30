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
import { Position } from '@xyflow/react'
import type { Node, NodeProps } from '@xyflow/react'
import { memo } from 'react'

import BareNode from './BareNode'
import type { BareNodeProps } from './BareNode'
import StyledHandle from './StyleHandle'

type FlowNodeData = BareNodeProps & { finished: boolean; name: string } & Record<string, unknown>
type FlowNodeType = Node<FlowNodeData, 'flowNode'>
export type FlowNodeProps = NodeProps<FlowNodeType>

function FlowNode({ data, isConnectable }: FlowNodeProps) {
  const { finished, ...rest } = data // Exclude `finished` from the data.

  return (
    <>
      {isConnectable && <StyledHandle type="target" position={Position.Left} />}
      <BareNode {...rest} />
      {isConnectable && <StyledHandle type="source" position={Position.Right} />}
    </>
  )
}

export default memo(FlowNode)
