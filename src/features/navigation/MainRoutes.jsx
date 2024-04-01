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
import { useEffect, useState } from 'react'
import AvatarButton from '../../ui/AvatarButton'
import { createStackNavigator } from '@react-navigation/stack'
import { useNavigation, useRoute } from '@react-navigation/native'
import { View } from 'react-native'
import ButtonIcon from '../../ui/ButtonIcon'

enableScreens()

const mapName = 'Map'
const listName = 'List'

const Tab = createBottomTabNavigator()

export default function MainRoutes() {
  const isKeyboardVisible = useKeyboardVisibility()
  const { currentLocation } = useMapContext()
  const { AccontPanelVisible, setCurrentRoute, currentRoute } = useUserContext()
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { variant } = useDarkMode()
  const translateY = useSharedValue(0)

  const [activeRoute, setActiveRoute] = useState(mapName)
  useEffect(() => {
    return () => {
      translateY.value = withTiming(0)
    }
  }, [translateY])

  useEffect(() => {
    setCurrentRoute(activeRoute)
  }, [activeRoute, setCurrentRoute])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            isKeyboardVisible || currentLocation || AccontPanelVisible
              ? withTiming(80)
              : withTiming(translateY.value),
        },
      ],
    }
  })

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
    <View style={{ width: '100%', height: '100%' }}>
      {/* {session && (
        <>
        </>
      )} */}

      <ButtonIcon
        iconName={isDarkMode ? 'sunny' : 'moon'}
        onPressFunction={toggleDarkMode}
        top={'50px'}
        color={theme.colors.accent}
      />
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
        <Tab.Screen
          name={mapName}
          component={MapScreen}
          listeners={({ route }) => {
            setActiveRoute(route.name)
          }}
        />
        <Tab.Screen
          name={listName}
          component={ListScreen}
          listeners={({ route }) => {
            setActiveRoute(route.name)
          }}
        />
      </Tab.Navigator>
    </View>
  )
}
