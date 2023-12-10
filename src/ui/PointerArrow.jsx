import { useEffect, useState } from 'react'
import { TouchableHighlight, Animated, Easing } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import theme from '../theme'
import styled from 'styled-components'

import { useDarkMode } from '../contexts/DarkModeContext'

const StyledPointerArrow = styled(TouchableHighlight)`
  position: absolute;
  top: 400px;
  right: 25px;
  z-index: 9;
  padding: 8px 9.5px;
  border-radius: ${theme.radiuses.full};
  background: ${(props) => props.variant.background || theme.colors.background};
`
const AnimatedIcon = styled(Animated.View)`
  /* transform: rotate(${(props) => `${props.angle}rad`}); */
`

export default function PointerArrow({
  fromCoordinate,
  toCoordinate,
  onPress,
}) {
  const { variant } = useDarkMode()

  const [animatedAngle,setAnimatedAngle] = useState(new Animated.Value(0))

  const angle = Math.atan2(
    toCoordinate.longitude - fromCoordinate.longitude,
    toCoordinate.latitude - fromCoordinate.latitude
  )
  const startAnimation = (newAngle) => {
    Animated.timing(animatedAngle, {
      toValue: newAngle,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
    setAnimatedAngle(new Animated.Value(newAngle))
  }

  useEffect(() => {
    startAnimation((angle * 180) / Math.PI)
  }, [angle])

  // console.log('angle:', angle)

  return (
    <StyledPointerArrow
      variant={variant}
      onPress={onPress}
      underlayColor={variant.listItem}
    >
      <AnimatedIcon
        style={{
          transform: [
            {
              rotate: animatedAngle.interpolate({
                inputRange: [-1, 360],
                outputRange: ['-1deg', '360deg'],
              }),
            },
          ],
        }}
      >
        <Icon name='caret-up' size={33} color={theme.colors.secondaryAccent} />
      </AnimatedIcon>
    </StyledPointerArrow>
  )
}
