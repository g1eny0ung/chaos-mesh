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
import { Avatar, Card } from '@mui/joy'
import Container from '@mui/system/Container'

interface NotFoundProps {
  children: React.ReactNode
  img: React.ReactNode
}

const NotFound: React.FC<NotFoundProps> = ({ children, img }) => (
  <Container maxWidth="md">
    <Card variant="outlined" sx={{ alignItems: 'center', width: '100%', py: 6 }}>
      <Avatar variant="soft" color="primary" sx={{ mb: 1, '--Avatar-size': '4.5rem' }}>
        {img}
      </Avatar>
      {children}
    </Card>
  </Container>
)

export default NotFound
