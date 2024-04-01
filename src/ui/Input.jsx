import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import styled from 'styled-components'
import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDarkMode } from '../contexts/DarkModeContext'
import { useState } from 'react'
import { Controller } from 'react-hook-form'

const StyledInput = styled(TextInput)`
  flex: 1;
  height: 55px;
  padding: 12px;
  font-size: 18px;
  color: ${theme.colors.accent};
`

const TextBox = styled(View)`
  background-color: ${theme.colors.background};
  border-radius: ${theme.radiuses.full};
  flex-direction: row;
  align-items: center;
  padding-horizontal: 12px;
  position: relative;
  border: ${(props) => props.border};
`

const ErrorMessage = styled(Text)`
  position: absolute;
  width: 100%;
  bottom: 3px;
  left: 14%;
  opacity: 1;
  font-size: 10px;
  color: ${theme.colors.error};
  text-align: left;
  z-index: 99;
`

const Container = styled(View)`
  position: relative;
`

const Eye = styled(TouchableOpacity)`
  margin-left: auto;
  margin-right: 4px;
`

export default function Input({
  name,
  control,
  rules = {},
  placeholder,
  iconName,
  iconColor,
  type,
  error,
}) {
  const { variant } = useDarkMode()
  const color = iconColor || variant.textSecondary

  const [passwordVisibility, setPasswordVisibility] = useState(true)
  const [rightIcon, setRightIcon] = useState('eye')

  const passwordCondition = type === 'password'

  const handlePasswordVisibility = () => {
    setRightIcon((prevIcon) => (prevIcon === 'eye' ? 'eye-off-outline' : 'eye'))
    setPasswordVisibility(!passwordVisibility)
  }

  return (
    <View>
      <Controller
        control={control}
        rules={rules}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Container>
            <TextBox
              border={error ? theme.colors.error : theme.colors.background}
            >
              <Icon name={iconName} size={22} color={color} />
              <StyledInput
                id={type}
                type={type}
                placeholder={placeholder}
                placeholderTextColor={variant.textSecondary}
                value={value}
                autoComplete={type === 'password' ? 'current-password' : null}
                autoCorrect={type === 'password' ? false : true}
                secureTextEntry={type === 'password' && passwordVisibility}
                onChangeText={onChange}
                onBlur={onBlur}
              />
              {passwordCondition && value && (
                <Eye onPress={handlePasswordVisibility}>
                  <Icon name={rightIcon} size={25} color={color} />
                </Eye>
              )}
            </TextBox>
            {error && <ErrorMessage>{error.message || 'Error'}</ErrorMessage>}
          </Container>
        )}
        name={name}
      />
    </View>
  )
}
