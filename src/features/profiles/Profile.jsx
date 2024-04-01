import { Text, View } from 'react-native'
import ButtonIcon from '../../ui/ButtonIcon'
import { useUserContext } from '../../contexts/UserContext'
import { useGetProfile } from './useGetProfile'
import Spinner from '../../ui/Spinner'
import { useDarkMode } from '../../contexts/DarkModeContext'
import styled from 'styled-components/native'
import { Image } from 'expo-image'
import ProfileLink from './ProfileLink'
import ButtonText from '../../ui/ButtonText'
import theme from '../../theme'
import useUser from '../authentication/useUser'
import { BottomSheetView } from '@gorhom/bottom-sheet'
import useProfileActions from './useProfileActions'
import { useNavigation } from '@react-navigation/native'
import { useBottomSheet } from '@gorhom/bottom-sheet'

export const Avatar = styled(Image)`
  aspect-ratio: 1;
  border-radius: 100px;
  border-width: 3px;
  border-color: ${(props) => props.variant.accent};
`
export const Name = styled(Text)`
  padding: 5px 10px;
  color: ${(props) => props.variant.accent};
  font-size: 18px;
  font-weight: bold;
  border-color: ${(props) => props.variant.backgroundTrSolid};
`
const UserText = styled(Text)`
  padding: 5px 10px;
  color: ${(props) => props.variant.textSecondary};
  font-size: 15px;
  font-weight: bold;
  border-color: ${(props) => props.variant.backgroundTrSolid};
  text-align: center;
`

const ProfileBox = styled(View)`
  display: flex;
  align-items: center;
  gap: 15px;
`
const Container = styled(BottomSheetView)`
  display: flex;
  background-color: ${(props) => props.variant.underlay};
  width: 90%;
  height: 95%;
  align-self: center;
  padding: 20px;
  gap: 40px;
  border-radius: ${theme.radiuses.lg};
`

const Links = styled(View)`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 5px;
`

export default function Profile() {
  const { setShownProfile, shownProfile } = useUserContext()
  const { isFetching, profile } = useGetProfile(shownProfile)
  const { user } = useUser()
  const { variant } = useDarkMode()
  const { matchProfile, unmatchProfile, isMatched, isPending, isLoading, currentMatch } =
  useProfileActions(profile?.id)
  const {navigate } = useNavigation()
  const { close } = useBottomSheet()

  
  const handleGoBack = () => setShownProfile(null)
  const navigateToConversation = ()=>{
    navigate('Chat', {matchId: currentMatch?.id, profile: profile} )
    close()
  }
  
  let parsedLinks = null
  try {
    if (typeof profile?.links === 'string' && profile?.links.trim() !== '') {
      parsedLinks = JSON.parse(profile?.links)
      // console.log(parsedLinks)
    } else {
      console.log('Profile has no links')
    }
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }

  if (isFetching) return <Spinner size={'large'} />



  return (
    <Container variant={variant}>
      <ButtonIcon
        iconName={'chevron-back-outline'}
        color={variant.accent}
        style={'left: 10px; top:10px;'}
        onPressFunction={handleGoBack}
      />
      {isMatched&&<ButtonIcon
        iconName={'chatbubble-ellipses'}
        color={variant.accent}
        style={'right: 10px; top:10px;'}
        onPressFunction={navigateToConversation}
      />}

      <ProfileBox variant={variant}>
        <Avatar
          variant={variant}
          source={
            profile?.avatar
              ? profile?.avatar
              : require(`../../../assets/default-user.jpg`)
          }
          style={{ width: 100, height: 100 }}
          alt={`Avatar of ${profile?.name}}`}
        />
        <Name variant={variant}>{profile?.name}</Name>
        {parsedLinks?.length ? (
          <Links>
            {parsedLinks?.map((link) => (
              <ProfileLink link={link} key={link.id}></ProfileLink>
            ))}
          </Links>
        ) : (
          <View
            style={{ height: 60, display: 'flex', justifyContent: 'center' }}
          >
            <UserText variant={variant}>
              {' '}
              {profile?.name} hasn't provided any links...
            </UserText>
          </View>
        )}
      </ProfileBox>
      {profile?.id !== user.id ? (
        isMatched || isPending ? (
          <ButtonText onPressFunction={unmatchProfile} isLoading={isLoading}>
            {!isPending ? 'Unmatch' : 'Cancel request'}
          </ButtonText>
        ) : (
          <ButtonText onPressFunction={matchProfile} isLoading={isLoading}>
            Match
          </ButtonText>
        )
      ) : null}
    </Container>
  )
}
