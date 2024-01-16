import { ActivityIndicator, SafeAreaView } from 'react-native'
import theme from '../theme'
import useUser from '../features/authentication/useUser'
import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const navigation = useNavigation()
  // Load authenticated user
  const { isLoading, isAuthenticated } = useUser()

  
  // Redirection
  useEffect(()=>{
    if(!isAuthenticated && !isLoading) navigation.navigate('AuthScreen')
  }
, [isAuthenticated,isLoading, navigation])

// Show spinner
if (isLoading)
  return (
    <SafeAreaView style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.backgroundTrSolid}}>
      <ActivityIndicator size={'large'} color={theme.colors.accent} />
    </SafeAreaView>
  )
  // Render app
  if(isAuthenticated) return children

  return children
}
