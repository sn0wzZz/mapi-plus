import React from 'react'
import { StatusBar, SafeAreaView } from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/Ionicons'
import styled from 'styled-components/native'
import theme from '../theme'

// Screens
import MapScreen from '../features/map/MapScreen'
import ListScreen from '../features/list/ListScreen'

import ButtonIcon from './ButtonIcon'

import { useDarkMode } from '../contexts/DarkModeContext'
import { useMapContext } from '../contexts/MapContext'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'

const mapName = 'Map'
const listName = 'List'

const Tab = createBottomTabNavigator()

const Container =styled(SafeAreaView)`
  z-index: -99;
  width: 100%;
  height: 100%;
`

export default function MainNav() {
  const {isDarkMode, toggleDarkMode} = useDarkMode()
  const {inputIsFocused, searchIsGeoCoords, currentLocation} = useMapContext()

    const isKeyboardVisible = useKeyboardVisibility()
    console.log('Is keyboard visible: ', isKeyboardVisible, inputIsFocused, currentLocation, searchIsGeoCoords)


  const variant = isDarkMode? theme.colors : theme.colorsLight
  const options = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.accent,
    tabBarInactiveTintColor: theme.colors.accent,
    tabBarShowLabel: false,
    tabBarStyle: {
      position: 'absolute',
      top: 670,
      left: 20,
      right: 90,
      elevation: 0,
      backgroundColor: variant.background,
      backDropFilter: 'blur(20px)',
      height: 60,
      borderTopWidth: 0,
      borderRadius: 40,
      zIndex: isKeyboardVisible || searchIsGeoCoords || currentLocation ? -1 : 1,
    },
    tabBarIcon: ({ focused, color, size }) => {
      let iconName
      let rn = route.name

      if (rn === mapName) {
        iconName = focused ? 'location' : 'location-outline'
      } else if (rn === listName) {
        iconName = focused ? 'reader' : 'reader-outline'
      }
      return <Icon name={iconName} size={size} color={color} />
    },
  })

  return (
    <Container>
      <ButtonIcon
        iconName={isDarkMode ? 'sunny' : 'moon'}
        onPressFunction={toggleDarkMode}
        top={'10px'}
        color={theme.colors.accent}
      />
      <NavigationContainer style={{ position: 'relative', zIndex: -2 }}>
        <StatusBar style='auto' />
        <Tab.Navigator initialRouteName={mapName} screenOptions={options}>
          <Tab.Screen name={mapName} component={MapScreen} />
          <Tab.Screen name={listName} component={ListScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Container>
  )
}
