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
import WelcomeSVG from '@/images/assets/undraw_server_down_s-4-lk.svg'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Button, Card, IconButton, Typography } from '@mui/joy'
import { useTour } from '@reactour/tour'

const Welcome = () => {
  const { setIsOpen } = useTour()

  return (
    <Card
      variant="outlined"
      sx={{
        display: {
          xs: 'none',
          sm: 'flex',
        },
        height: 175,
        my: 1.5,
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="start" height="100%">
        <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
          <div>
            <Typography level="h4" component="h1" fontWeight="xl">
              Welcome, Chaos Mesher!
            </Typography>
            <Typography color="neutral">If you are new, we recommend that you start with the tutorial.</Typography>
          </div>

          <Box display="flex" gap={1.5}>
            <Button onClick={() => setIsOpen(true)}>Tutorial</Button>
          </Box>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <img src={WelcomeSVG} alt="Welcome" style={{ position: 'relative', bottom: 30, height: 175 }} />
        </Box>

        <IconButton variant="outlined" size="sm">
          <CloseIcon />
        </IconButton>
      </Box>
    </Card>
  )
}

export default Welcome
