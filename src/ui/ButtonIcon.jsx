import {
  ActivityIndicator,
  TouchableHighlight,
  View,
  Linking,
  Text,
} from 'react-native'
import styled from 'styled-components/native'

import { useDarkMode } from '../contexts/DarkModeContext'
import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'
import IconFA from 'react-native-vector-icons/FontAwesome6'

const StyledTouchableHighLight = styled(TouchableHighlight)`
  position: absolute;
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

const Bubble = styled(Text)`
  padding: 1px 7px;
  position: absolute;
  border-radius: ${theme.radiuses.full};
  color: ${(props) => props.variant.background};
  background: ${(props) => props.variant.accent};
  top: -20px;
  left: 20px;
`

const socialMedias = [
  'facebook',
  'twitter',
  'snapchat',
  'instagram',
  'reddit',
  'tumblur',
  'github',
  'youtube',
  'vk',
]

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
  size = 22,
  bgSize = 60,
  loaderColor,
  url,
  bubble,
}) {
  const { variant } = useDarkMode()

  const handleOpenLink = async () => {
    if (url) {
      await Linking.openURL(url)
    }
  }

  const matchingLink = socialMedias.find((media) =>
    url?.toLowerCase().includes(media)
  )
  const icon = matchingLink ? matchingLink==='twitter'? `x-twitter`:`logo-${matchingLink}` : 'earth-outline'

  return (
    <>
      <StyledTouchableHighLight
        disabled={disabled}
        variant={variant}
        underlayColor={underlay || variant.underlay}
        top={top}
        bottom={bottom}
        bgColor={bgColor}
        onPress={onPressFunction || handleOpenLink}
        onLongPress={onLongPressFunction}
        left={left}
        style={style}
        bgSize={bgSize}
      >
        <View>
          {bubble && <Bubble variant={variant}>{bubble}</Bubble>}
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              color={loaderColor || theme.colors.accent}
            />
          ) : matchingLink === 'twitter' ? (
            <IconFA name={iconName || icon} size={18} color={color} />
          ) : (
            <Icon name={iconName || icon} size={size} color={color} />
          )}
        </View>
      </StyledTouchableHighLight>
    </>
  )
}
