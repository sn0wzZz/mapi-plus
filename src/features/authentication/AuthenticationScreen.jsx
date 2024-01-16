import {
  SafeAreaView,
  ImageBackground,
  Text,
  TouchableOpacity,
} from 'react-native'

import image from '../../../assets/auth-bg.png'
import logo from '../../../assets/adaptive-icon.png'
import styled from 'styled-components/native'
import Logo from '../../ui/Logo'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import theme from '../../theme'
import useKeyboardVisibility from '../../utils/useKeyboardVisibility'
import { useState } from 'react'
import DismissKeyboard from '../../ui/DismissKeyboard'
import CustomTabView from '../../ui/CustomTabView'

const StyledImageBG = styled(ImageBackground)`
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
`

const renderScene = SceneMap({
  first: LoginForm,
  second: SignupForm,
})

const authRoutes = [
  { key: 'first', title: 'Login' },
  { key: 'second', title: 'Sign Up' },
]

export default function AuthenticationScreen() {
  const isKeyboardVisible = useKeyboardVisibility()
  return (
    <SafeAreaView style={{ background: 'red' }}>
      <StyledImageBG
        source={image}
        resizeMode='cover'
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {!isKeyboardVisible && <Logo logo={logo} />}
        <DismissKeyboard>
          <CustomTabView renderScene={renderScene} tabRoutes={authRoutes} width={137} position='bottom'/>
        </DismissKeyboard>
      </StyledImageBG>
    </SafeAreaView>
  )
}
