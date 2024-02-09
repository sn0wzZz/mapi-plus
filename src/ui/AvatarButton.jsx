import { TouchableOpacity } from 'react-native'
import useUser from '../features/authentication/useUser'
import styled from 'styled-components/native'
import { Image } from 'expo-image'
import { useDarkMode } from '../contexts/DarkModeContext'
import Spinner from './Spinner'
import { useUserContext } from '../contexts/UserContext'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'

const Button = styled(TouchableOpacity)`
position: absolute;
z-index:99;
bottom: 30px;
left:35%;
display: flex;
align-items: center;
justify-content: center;
width: 40px;
height: 40px;
background-color: ${props=>props.variant.accent};
border-radius: 100px;
`

const Avatar = styled(Image)`
  aspect-ratio: 1;
  border-width: 2px;
  border-color: ${(props) => props.variant.accent};
  border-radius: 100px;
`

export default function AvatarButton() {
  const { user, isPending } = useUser()
  const {variant} = useDarkMode()
  const {avatar, name} = user?.user_metadata || {avatar: ''}
  const {setUserPanelVisible, userPanelVisible} = useUserContext()
  const isKeyboardVisible= useKeyboardVisibility()

  const pressHandler = ()=>{ setUserPanelVisible(cur=>!cur)}
  // console.log(avatar)
  if(!isKeyboardVisible&& !userPanelVisible) return (
    <Button onPress={pressHandler} variant={variant}>
      {user ? (
        <Avatar
        variant={variant}
        source={avatar ? avatar : require('../../assets/default-user.jpg')}
        style={{ width: 40, height: 40 }}
        alt={`Avatar of ${name}}`}
        />
      ) : (
        <Spinner color={variant.textWhite} />
      )}
    </Button>
  )
}
