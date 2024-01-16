import { useState } from 'react'
import { TabBar, TabView } from 'react-native-tab-view'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'
import { Text, TouchableOpacity } from 'react-native'
import { useDarkMode } from '../contexts/DarkModeContext'

export default function CustomTabView({
  renderScene,
  tabRoutes,
  position,
  marginTop= 0 ,
  width= 134.5
}) {
  const isKeyboardVisible = useKeyboardVisibility()
  const [index, setIndex] = useState(0)
  const [routes] = useState(tabRoutes)
  const { variant } = useDarkMode()
  return (
    <TabView
      style={{
        width: '100%',
        height: '20%',
        marginTop: !isKeyboardVisible ? marginTop : 120,
        alignSelf: 'center',
      }}
      navigationState={{ index, routes }}
      swipeEnabled={!isKeyboardVisible}
      renderScene={renderScene}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ display: 'none' }}
          pressColor={'transparent'}
          activeColor={variant.accent}
          style={{
            display: isKeyboardVisible ? 'none' : '',
            backgroundColor: variant.background,
            borderRadius: 99,
            marginBottom: 40,
            maxWidth: width,
            width: '100%',
            alignSelf: 'center',
            elevation: 0,
          }}
          renderTabBarItem={({ route }) => {
            const focused =
              props.navigationState.index ===
              props.navigationState.routes.findIndex((r) => r.key === route.key)
            return (
              <TouchableOpacity
                style={{
                  padding: 10,
                  backgroundColor: focused ? variant.accent : 'transparent', // Change the background color based on focus
                  borderRadius: 99,
                }}
                onPress={() => {
                  props.jumpTo(route.key)
                  // Handle tab press
                  // You may want to use `props.jumpTo(route.key)` to switch to the corresponding tab
                }}
              >
                <Text
                  style={{
                    color: focused ? 'black' : variant.textSecondary,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  {route.title}
                </Text>
              </TouchableOpacity>
            )
          }}
        />
      )}
      tabBarPosition={position}
      pageMargin={'10px'}
      onIndexChange={setIndex}
      initialLayout={{
        width: '100%',
        margin: 20,
        display: 'flex',
        justifyContent: 'center',
      }}
      index={index}
    />
  )
}
