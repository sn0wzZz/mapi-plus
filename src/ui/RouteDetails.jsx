import { ActivityIndicator, Keyboard, Text, View } from 'react-native'
import { useDarkMode } from '../contexts/DarkModeContext'
import styled from 'styled-components'
import theme from '../theme'
import ButtonIcon from './ButtonIcon'
import { useMapContext } from '../contexts/MapContext'
import useKeyboardVisibility from '../utils/useKeyboardVisibility'

import { secondsToHoursMinutes, metersToKilometers } from '../utils/helpers'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Box = styled(View)`
  background-color: ${(props) => props.variant.background};
  position: absolute;
  bottom: ${(props) =>
    props.isKeyboardVisible && !props.currentLocation? '20px' : '90px'};
  right: 80px;
  z-index: 9;
  padding: 11px;
  border-radius: ${theme.radiuses.md};
  opacity: ${(props) => (props.searchIsActive ? 0 : 1)};
  /* flex: 0; */
  flex-direction: row;
`
const StyledText = styled(Text)`
  width: 100%;
  font-weight: bold;
  margin-right: 10px;
  color: ${(props) => props.variant.textSecondary};
`


export default function RouteDetails({
  routeDetails,
  isLoadingDirections,
  searchIsActive,
}) {
  const { distance, duration } = routeDetails
  const { variant } = useDarkMode()
  const { currentLocation, clearRoute } = useMapContext()
  const  isKeyboardVisible  = useKeyboardVisibility()
  // console.log(isKeyboardVisible, Boolean(currentLocation))

  
  return (
    <Box variant={variant} isKeyboardVisible={isKeyboardVisible} currentLocation={currentLocation} searchIsActive={searchIsActive}>
      {isLoadingDirections ? (
        <ActivityIndicator
          color={theme.colors.accent}
          size={35}
        />
      ) : (
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <View>
            <StyledText variant={variant}>
              {<Icon name='map-marker-distance' color={theme.colors.accent} />}{' '}
              {metersToKilometers(distance)}
            </StyledText>
            <StyledText variant={variant}>
              {<Icon name='timer-outline' color={theme.colors.accent} />}{' '}
              {secondsToHoursMinutes(duration)}
            </StyledText>
          </View>
          <ButtonIcon
            onPressFunction={clearRoute}
            iconName={'close'}
            color={theme.colors.textWhite}
            bgColor={variant.error}
            underlay={variant.errorActive}
            disabled={isLoadingDirections}
            style={`position: relative; right: 0; height: 40px; width: 40px`}
          />
        </View>
      )}
    </Box>
  )
}
