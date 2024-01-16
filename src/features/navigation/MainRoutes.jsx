import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import useKeyboardVisibility from '../../utils/useKeyboardVisibility'
import { useMapContext } from '../../contexts/MapContext'
import { useDarkMode } from '../../contexts/DarkModeContext'
import MapScreen from '../map/MapScreen'
import ListScreen from '../list/ListScreen'
import Icon from 'react-native-vector-icons/Ionicons'


const mapName = 'Map'
const listName = 'List'

const Tab = createBottomTabNavigator()

export default function MainRoutes() {
  const isKeyboardVisible = useKeyboardVisibility()
    const { searchIsGeoCoords, currentLocation } = useMapContext()
  // console.log('Is keyboard visible: ', isKeyboardVisible, inputIsFocused, currentLocation, searchIsGeoCoords)

  const {variant} = useDarkMode()
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
      backDropFilter: 'blur(20px)',
      height: 60,
      borderTopWidth: 0,
      borderRadius: 40,
      zIndex:
        isKeyboardVisible || searchIsGeoCoords || currentLocation ? -1 : 1,
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
    <Tab.Navigator initialRouteName={mapName} screenOptions={options}>
      <Tab.Screen name={mapName} component={MapScreen} />
      <Tab.Screen name={listName} component={ListScreen} />
    </Tab.Navigator>
  )
}
