import { TouchableHighlight, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../theme'

import { useDarkMode } from '../contexts/DarkModeContext'

import Icon from 'react-native-vector-icons/Ionicons'

const StyledTouchableHighLight = styled(TouchableHighlight)`
  position: absolute;
  /* flex: 1; */
  justify-content: center;
  align-items: center;
  background-color: ${props=> props.bgColor? props.bgColor : props.variant.background};
  border-radius: ${theme.radiuses.full};
  width: 60px;
  height: 60px;
  z-index: 9;
  right: 20px;
  top: ${(props) => props.top};
  bottom: ${props=> props.bottom};
  ${props=> props.style}
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
  disabled
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
      style={style}
    >
      <View>
        <Icon name={iconName} size={22} color={color} />
      </View>
    </StyledTouchableHighLight>
  )
}
