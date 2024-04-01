import { Image } from 'expo-image'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'
import { useDarkMode } from '../../contexts/DarkModeContext'
import { TouchableOpacity, useBottomSheet } from '@gorhom/bottom-sheet'
import theme from '../../theme'
import ButtonIcon from '../../ui/ButtonIcon'
import { useUserContext } from '../../contexts/UserContext'
import useUser from '../authentication/useUser'

import useProfileActions from './useProfileActions'
import { useNavigation } from '@react-navigation/native'

const ProfileBox = styled(View)`
  width: 100%;
  display: flex;
  background-color: ${(props) => props.variant.overlay};
  flex-direction: row;
  padding: 10px;
  margin: 2.5px;
  border-radius: ${theme.radiuses.md};
  align-items: center;
`

const ProfileButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  flex-direction: row;
`

const Avatar = styled(Image)`
  aspect-ratio: 1;
  border-width: 2px;
  border-color: ${(props) => props.variant.accent};
  border-radius: 100px;
`

const Name = styled(Text)`
  padding: 5px 10px;
  color: ${(props) => props.variant.accent};
  font-size: 18px;
  font-weight: bold;
  width: 100%;
  border-color: ${(props) => props.variant.backgroundTrSolid};
`

export default function ProfileItem({ item }) {
  const { name, avatar } = item
  const { user } = useUser()
  const { variant } = useDarkMode()
  const { setShownProfile } = useUserContext()
    const { navigate } = useNavigation()
    const { close } = useBottomSheet()

  const { matchProfile, unmatchProfile, isMatched, isPending ,currentMatch} =
    useProfileActions(item?.id)

  const handleShowProfile = () => {
    setShownProfile(item.id)
    // console.log(item.id)
  }
  const navigateToConversation = () => {
    navigate('Chat', { matchId: currentMatch?.id, profile: item })
    close()
  }
  return (
    <ProfileBox key={item.id} variant={variant}>
      <ProfileButton onPress={handleShowProfile}>
        <Avatar
          variant={variant}
          source={avatar ? avatar : require('../../../assets/default-user.jpg')}
          style={{ width: 90, height: 90 }}
          alt={`Avatar of ${name}}`}
        />

        <Name variant={variant}>{name}</Name>
      </ProfileButton>
      {user?.id !== item?.id ? (
        isMatched || isPending ? (
          <View
            style={{
              marginLeft: 'auto',
              display: 'felx',
              flexDirection: 'row',
            }}
          >
            {isMatched && (
              <ButtonIcon
                iconName={'chatbubble-ellipses'}
                bgSize={45}
                color={variant.textSecondary}
                style={'position:relative;margin-right: 7.5px;'}
                onPressFunction={navigateToConversation}
              />
            )}
            <ButtonIcon
              iconName={'person-remove'}
              bgSize={45}
              color={variant.textSecondary}
              style={'position:relative;margin-left: auto;'}
              onPressFunction={unmatchProfile}
            />
          </View>
        ) : (
          <ButtonIcon
            iconName={'person-add'}
            bgSize={45}
            onPressFunction={matchProfile}
            color={variant.textSecondary}
            style={'position:relative; margin-left:auto;'}
          />
        )
      ) : null}
    </ProfileBox>
  )
}

