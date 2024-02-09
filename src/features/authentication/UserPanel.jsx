import { View } from 'react-native'
import useUser from './useUser'
import { useDarkMode } from '../../contexts/DarkModeContext'
import styled from 'styled-components/native'
import UserAvatar from './UserAvatar'

import Links from '../../ui/Links'
import DismissKeyboard from '../../ui/DismissKeyboard'

const User = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 10px;
`

const Panel = styled(View)`
  flex-direction: column;
  gap: 15px;
  width: 100%;
  padding: 1px 15px;
  /* background: red; */
  align-self: center;
`

export default function UserPanel() {
  const { user } = useUser()
  const { variant } = useDarkMode()
  return (
    <DismissKeyboard>
      <Panel>
        <UserAvatar />
        <Links />
      </Panel>
    </DismissKeyboard>
  )
}
