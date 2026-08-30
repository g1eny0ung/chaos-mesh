/*
 * Copyright 2025 Chaos Mesh Authors.
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
 */

const tutorialCardStorageKey = 'chaos-mesh-show-tutorial-card'

export function getTutorialCardVisibility(): boolean {
  if (typeof window === 'undefined') {
    return true
  }

  try {
    return window.localStorage.getItem(tutorialCardStorageKey) !== 'false'
  } catch {
    return true
  }
}

export function setTutorialCardVisibility(visible: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(tutorialCardStorageKey, String(visible))
  } catch {
    // Keep the setting usable when storage is unavailable.
  }
}
