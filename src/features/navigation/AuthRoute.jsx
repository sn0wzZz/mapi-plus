import { createStackNavigator } from '@react-navigation/stack';
import AuthenticationScreen from '../authentication/AuthenticationScreen'

const Stack = createStackNavigator()

export default function AuthRoute() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='AuthScreen' component={AuthenticationScreen} />
    </Stack.Navigator>
  )
}