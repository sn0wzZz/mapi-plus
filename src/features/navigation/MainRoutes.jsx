import React from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import {
  BottomTabBar,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'

import useKeyboardVisibility from '../../utils/useKeyboardVisibility'
import { useMapContext } from '../../contexts/MapContext'
import { useDarkMode } from '../../contexts/DarkModeContext'
import MapScreen from '../map/MapScreen'
import ListScreen from '../list/ListScreen'
import Icon from 'react-native-vector-icons/Ionicons'
import { useUserContext } from '../../contexts/UserContext'

import { enableScreens } from 'react-native-screens'
import { useEffect } from 'react'
import AvatarButton from '../../ui/AvatarButton'

enableScreens()

const mapName = 'Map'
const listName = 'List'

const Tab = createBottomTabNavigator()

export default function MainRoutes() {
  const isKeyboardVisible = useKeyboardVisibility()
  const { searchIsGeoCoords, currentLocation } = useMapContext()
  const { userPanelVisible } = useUserContext()
  const { variant } = useDarkMode()

  const translateY = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  useEffect(() => {
    translateY.value = withTiming(
      isKeyboardVisible ||
        searchIsGeoCoords ||
        currentLocation ||
        userPanelVisible
        ? 80
        : 0
    )
  }, [
    isKeyboardVisible,
    searchIsGeoCoords,
    currentLocation,
    userPanelVisible,
    translateY,
  ])

  const options = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.accent,
    tabBarInactiveTintColor: theme.colors.accent,
    tabBarShowLabel: false,
    tabBarStyle: {
      position: 'absolute',
      bottom: 20,
      left: 10,
      right: 80,
      elevation: 0,
      backgroundColor: variant.background,
      height: 60,
      borderTopWidth: 0,
      borderRadius: 40,
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
    <Tab.Navigator
      initialRouteName={mapName}
      screenOptions={options}
      tabBar={(props) => (
        <Animated.View style={{ ...animatedStyle }}>
          <AvatarButton />
          <BottomTabBar {...props} />
        </Animated.View>
      )}
    >
      <Tab.Screen name={mapName} component={MapScreen} />
      <Tab.Screen name={listName} component={ListScreen} />
    </Tab.Navigator>
  )
}
