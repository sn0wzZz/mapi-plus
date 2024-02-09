import { ActivityIndicator, TouchableHighlight, View } from 'react-native'
import styled from 'styled-components/native'

import { useDarkMode } from '../contexts/DarkModeContext'

import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'

const StyledTouchableHighLight = styled(TouchableHighlight)`
  position: absolute;
  /* flex: 1; */
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : props.variant.background};
  border-radius: ${theme.radiuses.full};
  width: ${(props) => props.bgSize}px;
  height: ${(props) => props.bgSize}px;
  z-index: 1;
  ${(props) => (props.left ? 'left: 10px;' : 'right: 10px;')}
  top: ${(props) => props.top};
  bottom: ${(props) => props.bottom};
  ${(props) => props.style}
`

export default function ButtonIcon({
  iconName,
  onPressFunction,
  onLongPressFunction,
  top,
  bottom,
  color,
  bgColor,
  style,
  underlay,
  left,
  disabled,
  isLoading,
  size=22,
  bgSize=60,
  loaderColor
}) {
  const { variant } = useDarkMode()
  return (
    <StyledTouchableHighLight
      disabled={disabled}
      variant={variant}
      underlayColor={underlay || variant.underlay}
      top={top}
      bottom={bottom}
      bgColor={bgColor}
      onPress={onPressFunction}
      onLongPress={onLongPressFunction}
      left={left}
      style={style}
      bgSize={bgSize}
    >
      <View>
        {isLoading ? (
          <ActivityIndicator animating={true} color={loaderColor||theme.colors.accent} />
        ) : (
          <Icon name={iconName} size={size} color={color} />
        )}
      </View>
    </StyledTouchableHighLight>
  )
}
