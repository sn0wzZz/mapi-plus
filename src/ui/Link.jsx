import { View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import IconFA from 'react-native-vector-icons/FontAwesome6'

import ButtonIcon from './ButtonIcon'
import styled from 'styled-components/native'
import { useDarkMode } from '../contexts/DarkModeContext'
import theme from '../theme'
import { useState } from 'react'
import { useUpdateUser } from '../features/authentication/useUpdateUser'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

const LinkBox = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.variant.underlay};
  padding: 5px;
  border-radius: ${theme.radiuses.md};
`

const Buttons = styled(View)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-left: auto;
`

const Url = styled(BottomSheetTextInput)`
  color: ${(props) => props.variant.text};
  font-weight: bold;
  width: 100%;
`

export default function Link({ links, link, iconName, setLinks }) {
  const [value, setValue] = useState('')
  const { updateUser } = useUpdateUser()
  const { variant } = useDarkMode()
  const { id } = link
  const pressHandler = () => {
    setLinks((links) => links.filter((link) => link.id !== id))
    updateUser(links)
  }
  return (
    <LinkBox variant={variant}>
      {iconName === 'logo-twitter' ? (
        <IconFA
          name={'x-twitter'}
          size={18}
          color={variant.accent}
          style={{
            borderRadius: 99,
            overflow: 'hidden',
            paddingHorizontal: 2.5,
          }}
        />
      ) : (
        <Icon
          name={iconName}
          size={22}
          color={variant.accent}
          style={{
            borderRadius: 99,
            overflow: 'hidden',
            paddingHorizontal: 2.5,
          }}
        />
      )}
      <Url variant={variant} value={link.url} onChangeText={setValue}></Url>
      <Buttons>
        {/* <ButtonIcon
          iconName='save'
          size={22}
          bgColor={variant.accent}
          bgSize={30}
          style={'right: 0; position: relative;'}
        /> */}
        <ButtonIcon
          onPressFunction={pressHandler}
          iconName='close'
          size={22}
          color={variant.text}
          bgColor={variant.error}
          underlay={variant.errorActive}
          bgSize={30}
          style={'right: 0; position: relative;'}
        />
      </Buttons>
    </LinkBox>
  )
}
