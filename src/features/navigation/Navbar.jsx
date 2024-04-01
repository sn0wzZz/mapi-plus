import { useEffect, useState } from 'react'
import { StatusBar, SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styled from 'styled-components/native'
import theme from '../../theme'
import { useDarkMode } from '../../contexts/DarkModeContext'
import ButtonIcon from '../../ui/ButtonIcon'
import MainRoutes from './MainRoutes'
import Toaster from './Toaster'
import AuthRoute from './AuthRoute'
import supabase from '../../services/supabase'
import { useUserContext } from '../../contexts/UserContext'
import Modal from '../../ui/Modal'

import Splash from '../../ui/Splash'
import ProfileList from '../profiles/ProfileList'
import Profile from '../profiles/Profile'
import { useMapContext } from '../../contexts/MapContext'
import useUser from '../authentication/useUser'
import useUserMatches from '../matches/useUserMatches'
import AccontPanel from '../authentication/AccuntPanel'
import useGetAllMatches from '../matches/useGetAllMatches'
import { createStackNavigator } from '@react-navigation/stack'
import { Chat } from '../chat/Chat'

const Container = styled(SafeAreaView)`
  z-index: -99;
  width: 100%;
  height: 100%;
  position: relative;
`

export default function Navbar() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const {
    AccontPanelVisible,
    shownProfile,
    profileList,
    userMatchesVisible,
    userMatchesList,
    setUserMatchesList,
    allMatchesList,
    setAllMatchesList,
  } = useUserContext()
  const { calloutIsPressed } = useMapContext()
  const { user } = useUser()

  const { allMatches } = useGetAllMatches()
  const { userMatches, isPending } = useUserMatches(user?.id, 'matched')
  const { userMatches: userPendings } = useUserMatches(user?.id, 'pending')

  useEffect(() => {
    setUserMatchesList(userMatches)
    setAllMatchesList(allMatches)
  }, [userMatches, userPendings, allMatches])

  useEffect(() => {
    const subscription = supabase
      .channel('matches_change')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          const newData =
            user.id === payload.new.user_id
              ? payload.new.profile_id
              : payload.new.user_id
          console.log('payload', newData)
          setUserMatchesList((oldProfiles) => [...oldProfiles, newData])
          setAllMatchesList((oldProfiles) => [...oldProfiles, newData])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'matches',
        },
        (payload) => {
          const newData = payload
          console.log('payload', newData)
          setUserMatchesList((oldProfiles) => {
            const index = oldProfiles.findIndex((p) => p.id === newData.id)
            if (index !== -1) {
              const newProfiles = [...oldProfiles]
              newProfiles.splice(index, 1)
              return newProfiles
            } else {
              return oldProfiles
            }
          })
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [userMatches])

  useEffect(() => {
    const restoreSession = async () => {
      try {
        setIsLoading(true)
        // Attempt to retrieve the session from AsyncStorage
        const storedSession = await AsyncStorage.getItem('supabaseSession')
        if (storedSession) {
          const parsedSession = JSON.parse(storedSession)
          setSession(parsedSession)
        }

        // Attach the onAuthStateChange listener
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)

          // Save the updated session to AsyncStorage
          AsyncStorage.setItem('supabaseSession', JSON.stringify(session))
        })
      } catch (error) {
        console.error('Error restoring session:', error)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  if (isLoading) return <Splash />

  const Stack = createStackNavigator()
  return (
    <Container>
      <StatusBar
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent={true}
      />
      <NavigationContainer style={{ position: 'relative', zIndex: -2 }}>
        {AccontPanelVisible && (
          <Modal>
            <AccontPanel />
          </Modal>
        )}
        {calloutIsPressed && profileList?.at(0) && (
          <Modal>
            {calloutIsPressed && shownProfile ? (
              <Profile />
            ) : (
              <ProfileList list={profileList} />
            )}
          </Modal>
        )}
        {userMatchesVisible && userMatchesList?.at(0) && (
          <Modal>
            {shownProfile ? (
              <Profile />
            ) : (
              <ProfileList listIds={userMatchesList} isLoading={isPending} />
            )}
          </Modal>
        )}
        <Stack.Navigator>
          {session && session.user ? (
            <Stack.Screen
              name='Tabs'
              component={MainRoutes}
              options={{ headerShown: false }}
            />
          ) : (
            <Stack.Screen
              name='Auth'
              component={AuthRoute}
              options={{ headerShown: false }}
            />
          )}
          <Stack.Screen
            name='Chat'
            component={Chat}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toaster />
    </Container>
  )
}
