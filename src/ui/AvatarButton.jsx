import { TouchableOpacity } from 'react-native'
import useUser from '../features/authentication/useUser'
import styled from 'styled-components/native'
import { Image } from 'expo-image'
import { useDarkMode } from '../contexts/DarkModeContext'
import Spinner from './Spinner'
import { useUserContext } from '../contexts/UserContext'
import { useBottomSheet } from '@gorhom/bottom-sheet'

const Button = styled(TouchableOpacity)`
  position: absolute;
  z-index: 99;
  bottom: 30px;
  left: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.variant.accent};
  border-radius: 100px;
`

const Avatar = styled(Image)`
  aspect-ratio: 1;
  border-width: 2px;
  border-color: ${(props) => props.variant.accent};
  border-radius: 100px;
`

export default function AvatarButton() {
  const { user, isFetching } = useUser()
  const { variant } = useDarkMode()
  const { setAccontPanelVisible, AccontPanelVisible } = useUserContext()

  const pressHandler = () => {
    setAccontPanelVisible(true)
  }
  // console.log('user',user)
  return (
    <Button onPress={pressHandler} variant={variant} disabled={!user}>
      {user ? (
        <Avatar
          variant={variant}
          source={
            user.user_metadata.avatar
              ? user.user_metadata.avatar
              : require('../../assets/default-user.jpg')
          }
          style={{ width: 40, height: 40 }}
          alt={`Avatar of ${user.user_metadata?.name}}`}
        />
      ) : (
        <Spinner color={variant.text} />
      )}
    </Button>
  )
}
