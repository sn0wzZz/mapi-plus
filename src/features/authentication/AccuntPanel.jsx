import { View } from 'react-native'
import useUser from './useUser'
import { useDarkMode } from '../../contexts/DarkModeContext'
import styled from 'styled-components/native'
import AccountCredentialsForm from './AccountCredentialsForm'

import LinkList from '../../ui/LinkList'
import DismissKeyboard from '../../ui/DismissKeyboardView'
import { BottomSheetView } from '@gorhom/bottom-sheet'

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

export default function AccontPanel() {
  return (
    <BottomSheetView>
      <DismissKeyboard>
        <Panel>
          <AccountCredentialsForm />
          <LinkList />
        </Panel>
      </DismissKeyboard>
    </BottomSheetView>
  )
}
