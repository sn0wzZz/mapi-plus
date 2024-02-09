import styled from 'styled-components/native'
import { Keyboard, Text, View } from 'react-native'
import useUser from './useUser'
import { useDarkMode } from '../../contexts/DarkModeContext'
import Icon from 'react-native-vector-icons/Ionicons'
import ButtonIcon from '../../ui/ButtonIcon'
import * as DocumentPicker from 'expo-document-picker'
import { useEffect, useState } from 'react'
import { useUpdateUser } from './useUpdateUser'
import * as FileSystem from 'expo-file-system'
import { Buffer } from 'buffer'
import { Image } from 'expo-image'
import { TextInput } from 'react-native-gesture-handler'
import theme from '../../theme'
import ButtonText from '../../ui/ButtonText'
import Logout from './Logout'

const StyledUserAvatar = styled(View)`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  font-weight: bold;
  font-size: 18px;
  /* color: red; */
`

const Avatar = styled(Image)`
  aspect-ratio: 1;
  border-radius: 100px;
  border-width: 3px;
  border-color: ${(props) => props.variant.accent};
`
const Credentials = styled(View)`
  width: 72%;
  gap: 5px;
`

const NameBox = styled(View)`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
  width: 100%;
  background-color: ${(props) => props.variant.underlay};
  border-radius: ${theme.radiuses.sm};
`
const Input = styled(TextInput)`
  padding: 5px 10px;
  color: ${(props) => props.variant.accent};
  font-size: 18px;
  font-weight: bold;
  width: 100%;

  border-color: ${(props) => props.variant.backgroundTrSolid};
  ${(props) =>
    props.middle && 'border-top-width: 1px;  border-bottom-width:1px; '}
  ${(props) => props.outer && ' width:90%;'}
`

const ErrorMessage = styled(Text)`
  position: absolute;
  font-size: 10px;
  color: ${(props) => props.variant.error};
  background-color: ${(props) => props.variant.backgroundTrSolid};
  padding: 1px 4px;
  align-self: center;
  border-radius: ${theme.radiuses.xs};
  top: 60%;
`

export default function UserAvatar() {
  const { variant } = useDarkMode()
  const { user } = useUser()
  const { name, avatar } = user?.user_metadata
  const [pickedImage, setPickedImage] = useState(null)
  const { updateUser, isUpdating } = useUpdateUser()
  const [tempName, setTempChange] = useState(name)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setError('')
  }, [password, confirmPassword])

  const updateAvatar = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      })

      if (!result.canceled) {
        const img = result.assets[0].uri

        const imageBase64 = await FileSystem.readAsStringAsync(img, {
          encoding: 'base64',
        })

        const imageBuffered = Buffer.from(imageBase64, 'base64')

        setPickedImage(imageBuffered)
        updateUser({ avatar: imageBuffered })
      } else {
        setPickedImage(null)
      }
    } catch (error) {
      console.error('Error picking image:', error)
    }
  }

  const saveCredentials = () => {
    try {
      if (!name && !password) return
      if (password && password.length <= 3)
        throw new Error('Password must be at least 6 charachters!')
      if (password !== confirmPassword) throw new Error('Passwords must match!')
      if (name !== tempName) {
        updateUser({ name: tempName })
        Keyboard.dismiss()
      }
      if (password && password.length >= 3 && password === confirmPassword) {
        updateUser({ password: password })
        setPassword('')
        setConfirmPassword('')
        Keyboard.dismiss()
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <StyledUserAvatar>
      <View>
        <Avatar
          variant={variant}
          source={avatar ? avatar : require('../../../assets/default-user.jpg')}
          style={{ width: 90, height: 90 }}
          alt={`Avatar of ${name}}`}
        />
        <ButtonIcon
          iconName={'images'}
          color={variant.textWhite}
          bgColor={variant.accent}
          size={18}
          style={'width: 30px; height: 30px; bottom: 0; right: 0;'}
          onPressFunction={updateAvatar}
          isLoading={isUpdating}
          underlay={variant.accentActive}
          loaderColor={variant.textWhite}
          disabled={isUpdating}
        />
      </View>
      <Credentials>
        <NameBox variant={variant}>
          <Input
            variant={variant}
            value={tempName}
            onChangeText={setTempChange}
            placeholder='Name'
            placeholderTextColor={variant.textSecondary}
            outer={true}
          />
          <Input
            variant={variant}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder='Password'
            placeholderTextColor={variant.textSecondary}
            middle={true}
          />
          <Input
            variant={variant}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            placeholder='Confirm password'
            placeholderTextColor={variant.textSecondary}
            outer={true}
          />
          {error && <ErrorMessage variant={variant}>{error}</ErrorMessage>}
          <Logout />
          <ButtonIcon
            iconName='save'
            color={variant.textWhite}
            bgColor={variant.accent}
            underlay={variant.accentActive}
            size={18}
            style={'width: 30px; height: 30px; bottom:4px; right: 4px;'}
            onPressFunction={saveCredentials}
            isLoading={isUpdating}
            loaderColor={variant.textWhite}
            disabled={isUpdating}
          />
        </NameBox>
      </Credentials>
    </StyledUserAvatar>
  )
}
