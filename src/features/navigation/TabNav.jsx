import { useEffect, useState } from 'react'
import { StatusBar, SafeAreaView } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import styled from 'styled-components/native'
import theme from '../../theme'
import { useDarkMode } from '../../contexts/DarkModeContext'
import ButtonIcon from '../../ui/ButtonIcon'
import AuthenticationScreen from '../authentication/AuthenticationScreen'
import MainRoutes from './MainRoutes'
import Toaster from './Toaster'
import AuthRoute from './AuthRoute'
import supabase from '../../services/supabase'

const Container = styled(SafeAreaView)`
  z-index: -99;
  width: 100%;
  height: 100%;
`

export default function TabNav() {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [session, setSession] = useState(null)

  useEffect(() => {
    const restoreSession = async () => {
      try {
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
      }
    }

    restoreSession()
  }, [])

  return (
    <Container>
      <StatusBar
        backgroundColor='transparent'
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent={true}
      />
      {session && (
        <ButtonIcon
          iconName={isDarkMode ? 'sunny' : 'moon'}
          onPressFunction={toggleDarkMode}
          top={'50px'}
          color={theme.colors.accent}
        />
      )}
      <NavigationContainer style={{ position: 'relative', zIndex: -2 }}>
        {session && session.user ? <MainRoutes /> : <AuthRoute />}
      </NavigationContainer>
      <Toaster />
    </Container>
  )
}
