/*
 * Copyright 2026 Chaos Mesh Authors.
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
import { useIntl } from 'react-intl'
import { useMatches } from 'react-router'

const APP_TITLE = 'Chaos Mesh'

interface HeadTitleProps {
  title?: string
}

interface RouteTitleHandle {
  title?: string
}

const HeadTitle = ({ title }: HeadTitleProps) => <title>{title ? `${title} | ${APP_TITLE}` : APP_TITLE}</title>

export const RouteHeadTitle = () => {
  const intl = useIntl()
  const matches = useMatches()
  const titleId = matches.reduce<string | undefined>((currentTitle, match) => {
    const routeTitle = (match.handle as RouteTitleHandle | undefined)?.title

    return routeTitle ?? currentTitle
  }, undefined)

  return titleId ? <HeadTitle title={intl.formatMessage({ id: titleId })} /> : null
}

export default HeadTitle
