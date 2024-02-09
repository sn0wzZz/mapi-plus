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
import UserPanel from '../authentication/UserPanel'
import Splash from '../../ui/Splash'

const Container = styled(SafeAreaView)`
  z-index: -99;
  width: 100%;
  height: 100%;
  position: relative;
`

export default function TabNav() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { userPanelVisible } = useUserContext()
  // console.log(session)

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

  return (
    <Container>
      <StatusBar
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent={true}
      />
      {session && (
        <>
          <ButtonIcon
            iconName={isDarkMode ? 'sunny' : 'moon'}
            onPressFunction={toggleDarkMode}
            top={'50px'}
            color={theme.colors.accent}
          />
        </>
      )}
      {userPanelVisible && (
        <Modal>
          <UserPanel />
        </Modal>
      )}
      <NavigationContainer style={{ position: 'relative', zIndex: -2 }}>
        {session && session.user ? <MainRoutes /> : <AuthRoute />}
      </NavigationContainer>
      <Toaster />
    </Container>
  )
}
