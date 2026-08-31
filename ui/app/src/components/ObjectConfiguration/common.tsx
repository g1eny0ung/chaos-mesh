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
import { List as JoyList, ListItem as JoyListItem, Table as JoyTable, Typography as JoyTypography } from '@mui/joy'
import type { ColorPaletteProp } from '@mui/joy'

import { type ExperimentKind } from '@/components/NewExperiment/types'
import i18n from '@/components/T'

import { objToArrBySep } from '@/lib/utils'

type TableProps = Omit<React.ComponentProps<typeof JoyTable>, 'size'> & {
  size?: 'small' | 'medium' | 'large' | 'sm' | 'md' | 'lg'
}

type TypographyProps = Omit<React.ComponentProps<typeof JoyTypography>, 'color' | 'variant'> & {
  variant?: 'body2' | 'subtitle2'
  color?: ColorPaletteProp | 'textSecondary'
  gutterBottom?: boolean
}

export const Table = ({ size, sx, children, ...props }: TableProps) => (
  <JoyTable
    {...props}
    borderAxis="none"
    size={size === 'small' ? 'sm' : size === 'medium' ? 'md' : size === 'large' ? 'lg' : size}
    sx={[
      {
        '--TableCell-paddingX': 0,
        '& td': { verticalAlign: 'middle' },
        '& td:first-of-type': {
          pr: 1.5,
          color: 'text.tertiary',
          overflowWrap: 'anywhere',
        },
        '& td:last-of-type': {
          overflowWrap: 'anywhere',
        },
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  >
    <colgroup>
      <col style={{ width: '7rem' }} />
      <col />
    </colgroup>
    {children}
  </JoyTable>
)

export const TableBody = (props: React.ComponentPropsWithoutRef<'tbody'>) => <tbody {...props} />
export const TableRow = (props: React.ComponentPropsWithoutRef<'tr'>) => <tr {...props} />
export const TableCell = (props: React.ComponentPropsWithoutRef<'td'>) => <td {...props} />

export const List = ({ sx, ...props }: React.ComponentProps<typeof JoyList>) => (
  <JoyList {...props} size="sm" sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]} />
)
export const ListItem = ({ sx, ...props }: React.ComponentProps<typeof JoyListItem>) => (
  <JoyListItem {...props} sx={[{ p: 0 }, ...(Array.isArray(sx) ? sx : [sx])]} />
)

export const Typography = ({ variant, color, gutterBottom, sx, ...props }: TypographyProps) => (
  <JoyTypography
    {...props}
    level={variant === 'subtitle2' ? 'title-sm' : variant === 'body2' ? 'body-sm' : undefined}
    color={color === 'textSecondary' ? 'neutral' : color}
    sx={[
      {
        mb: gutterBottom ? 1 : undefined,
        overflowWrap: variant === 'body2' ? 'anywhere' : undefined,
      },
      ...(Array.isArray(sx) ? sx : [sx]),
    ]}
  />
)

export const Selector = ({ data }: any) => (
  <Table size="small">
    <TableBody>
      {data.namespaces && (
        <TableRow>
          <TableCell>{i18n('k8s.namespaceSelectors')}</TableCell>
          <TableCell>
            <Typography variant="body2" color="textSecondary">
              {data.namespaces.join('; ')}
            </Typography>
          </TableCell>
        </TableRow>
      )}
      {data.labelSelectors && (
        <TableRow>
          <TableCell>{i18n('k8s.labelSelectors')}</TableCell>
          <TableCell>
            <Typography variant="body2" color="textSecondary">
              {objToArrBySep(data.labelSelectors, ': ').join('; ')}
            </Typography>
          </TableCell>
        </TableRow>
      )}
      {data.annotationSelectors && (
        <TableRow>
          <TableCell>{i18n('k8s.annotationSelectors')}</TableCell>
          <TableCell>
            <Typography variant="body2" color="textSecondary">
              {objToArrBySep(data.annotationSelectors, ': ').join('; ')}
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
)

const Pod = ({ data: { containerName } }: any) => (
  <>
    {containerName && (
      <TableRow>
        <TableCell>Container name</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {containerName}
          </Typography>
        </TableCell>
      </TableRow>
    )}
  </>
)

const Network = ({ data }: any) => (
  <>
    {data.direction && (
      <TableRow>
        <TableCell>Direction</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.direction}
          </Typography>
        </TableCell>
      </TableRow>
    )}
  </>
)

const IO = ({ data }: any) => (
  <>
    {data.delay && (
      <TableRow>
        <TableCell>Delay</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.delay}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {data.errno && (
      <TableRow>
        <TableCell>Errno</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.errno}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {data.attr && (
      <TableRow>
        <TableCell>Attr</TableCell>
        <TableCell>
          <List>
            {objToArrBySep(data.attr, ': ').map((d) => (
              <ListItem key={d}>
                <Typography variant="body2" color="textSecondary">
                  {d}
                </Typography>
              </ListItem>
            ))}
          </List>
        </TableCell>
      </TableRow>
    )}
    {data.volumePath && (
      <TableRow>
        <TableCell>Volume path</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.volumePath}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {data.path && (
      <TableRow>
        <TableCell>Path</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.path}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {data.containerName && (
      <TableRow>
        <TableCell>Container name</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.containerName}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {data.percent && (
      <TableRow>
        <TableCell>Percent</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.percent}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {data.methods && (
      <TableRow>
        <TableCell>Methods</TableCell>
        <TableCell>
          <List>
            {objToArrBySep(data.methods, ': ').map((d) => (
              <ListItem key={d}>
                <Typography variant="body2" color="textSecondary">
                  {d}
                </Typography>
              </ListItem>
            ))}
          </List>
        </TableCell>
      </TableRow>
    )}
  </>
)

export const Stress = ({ data: { stressors, stressngStressors, containerName } }: any) => (
  <>
    {stressors.cpu && stressors.cpu.workers > 0 && (
      <TableRow>
        <TableCell>CPU</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            workers: {stressors.cpu.workers}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            size: {stressors.cpu.size}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {stressors.memory && stressors.memory.workers > 0 && (
      <TableRow>
        <TableCell>Memory</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            workers: {stressors.memory.workers}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            size: {stressors.memory.size}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {stressngStressors && (
      <TableRow>
        <TableCell>Options of stress-ng</TableCell>
        <TableCell>
          <List>
            {objToArrBySep(stressngStressors, ': ').map((d) => (
              <ListItem key={d}>
                <Typography variant="body2" color="textSecondary">
                  {d}
                </Typography>
              </ListItem>
            ))}
          </List>
        </TableCell>
      </TableRow>
    )}
    {containerName && (
      <TableRow>
        <TableCell>Container name</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {containerName}
          </Typography>
        </TableCell>
      </TableRow>
    )}
  </>
)

const Time = ({ data }: any) => (
  <>
    {data.timeOffset && (
      <TableRow>
        <TableCell>Time offset</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {data.timeOffset}
          </Typography>
        </TableCell>
      </TableRow>
    )}
    {data.clockIds && (
      <TableRow>
        <TableCell>Clock ids</TableCell>
        <TableCell>
          <List>
            {objToArrBySep(data.clockIds, ': ').map((d) => (
              <ListItem key={d}>
                <Typography variant="body2" color="textSecondary">
                  {d}
                </Typography>
              </ListItem>
            ))}
          </List>
        </TableCell>
      </TableRow>
    )}
    {data.containerNames && (
      <TableRow>
        <TableCell>Container names</TableCell>
        <TableCell>
          <List>
            {objToArrBySep(data.containerNames, ': ').map((d) => (
              <ListItem key={d}>
                <Typography variant="body2" color="textSecondary">
                  {d}
                </Typography>
              </ListItem>
            ))}
          </List>
        </TableCell>
      </TableRow>
    )}
  </>
)

export const Experiment = ({ kind, data }: { kind: ExperimentKind; data: any }) => (
  <Table size="small">
    <TableBody>
      <TableRow>
        <TableCell>{i18n('newE.target.faultType')}</TableCell>
        <TableCell>
          <Typography variant="body2" color="textSecondary">
            {kind}
          </Typography>
        </TableCell>
      </TableRow>
      {['PodChaos', 'NetworkChaos', 'IOChaos'].includes(kind) && (
        <TableRow>
          <TableCell>{i18n('newE.target.faultAction')}</TableCell>
          <TableCell>
            <Typography variant="body2" color="textSecondary">
              {data.action}
            </Typography>
          </TableCell>
        </TableRow>
      )}
      {kind === 'PodChaos' && <Pod data={data} />}
      {kind === 'NetworkChaos' && <Network data={data} />}
      {kind === 'IOChaos' && <IO data={data} />}
      {kind === 'StressChaos' && <Stress data={data} />}
      {kind === 'TimeChaos' && <Time data={data} />}
    </TableBody>
  </Table>
)
