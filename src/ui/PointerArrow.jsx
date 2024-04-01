import React, { useEffect, useState } from 'react'
import { TouchableHighlight, Animated, Easing, Dimensions } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import theme from '../theme'
import styled from 'styled-components'

import { useDarkMode } from '../contexts/DarkModeContext'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

const StyledPointerArrow = styled(TouchableHighlight)`
  position: absolute;
  bottom: 310px;
  right: 15px;
  z-index: 9;
  padding: 8px 9.5px;
  border-radius: ${theme.radiuses.full};
  background: ${(props) => props.variant.background || theme.colors.background};
`

const AnimatedIcon = styled(Animated.View)``

export default function PointerArrow({
  fromCoordinate,
  toCoordinate,
  heading,
  onPress,
}) {
  const { variant } = useDarkMode()
  const [animatedAngle] = useState(new Animated.Value(0))

  useEffect(() => {
    const angle = Math.atan2(
      toCoordinate.longitude - fromCoordinate.longitude,
      toCoordinate.latitude - fromCoordinate.latitude
    )

    // Calculate the angle between the arrow and the pin
    const arrowOffsetRight = 20 // Adjust this value based on the actual offset from the right
    const arrowOffsetTop = 440 // Adjust this value based on the actual offset from the top
    const angleOffsetRight = Math.atan2(arrowOffsetRight, deviceWidth)
    const angleOffsetTop = Math.atan2(arrowOffsetTop, deviceHeight)

    // Calculate the final angle considering heading
    const finalAngle = angle - angleOffsetRight - (heading * Math.PI) / 180

    Animated.timing(animatedAngle, {
      toValue: finalAngle,
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
  }, [fromCoordinate, toCoordinate, heading])

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
                inputRange: [-Math.PI, Math.PI],
                outputRange: ['-180deg', '180deg'],
              }),
            },
          ],
        }}
      >
        <Icon name='caret-up' size={33} color={theme.colors.accentSecondary} />
      </AnimatedIcon>
    </StyledPointerArrow>
  )
}
