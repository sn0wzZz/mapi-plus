import { ActivityIndicator, Text, View } from 'react-native'
import { useDarkMode } from '../contexts/DarkModeContext'
import styled from 'styled-components'
import theme from '../theme'
import ButtonIcon from './ButtonIcon'
import useMapOperations from '../features/map/useMapOperations'
import { useMapContext } from '../contexts/MapContext'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useGeoCoding from '../features/map/useGeoCoding'

const Box = styled(View)`
  background-color: ${(props) => props.variant.background};
  position: absolute;
  top: 130px;
  width: auto;
  max-width: 150px;
  left: 20px;
  z-index: 9;
  padding: 15px;
  border-radius: ${theme.radiuses.md};
  display: flex;
  flex-grow: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`
const StyledText = styled(Text)`
  width: 100%;
  font-weight: bold;
  color: ${(props) => props.variant.textWhite};
`

function secondsToHoursMinutes(seconds) {
  const hours = Math.floor(seconds / 3600)
  const remainingSeconds = seconds % 3600
  const minutes = Math.floor(remainingSeconds / 60)

  const hoursString = hours > 0 ? `${hours} h` : ''
  const minutesString = minutes > 0 ? `${minutes} min` : ''

  return `${hoursString} ${minutesString}`.trim()
}

function metersToKilometers(meters) {
  const kilometers = meters / 1000
  return `${kilometers.toFixed(2)} km`
}

export default function RouteDetails({
  routeDetails,
  setRouteDetails,
  isLoadingDirections,
  setIsDirectionsDetailsVisible,
}) {
  const { distance, duration } = routeDetails
  const { variant } = useDarkMode()
  const { setPin } = useMapContext()

  const handlePress = () => {
    setRouteDetails({ directions: [], distance: '', duration: '' })
    setIsDirectionsDetailsVisible(false)
    setPin(null)
  }

  return (
    <Box variant={variant}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {isLoadingDirections ? (
          <ActivityIndicator color={theme.colors.accent} size={35} />
        ) : (
          <>
            <StyledText variant={variant}>
              {<Icon name='map-marker-distance' color={theme.colors.accent} />}{' '}
              {metersToKilometers(distance)}
            </StyledText>
            <StyledText variant={variant}>
              {<Icon name='timer-outline' color={theme.colors.accent} />}{' '}
              {secondsToHoursMinutes(duration)}
            </StyledText>
          </>
        )}
      </View>
      <ButtonIcon
        onPressFunction={handlePress}
        iconName={'close'}
        color={theme.colors.textWhite}
        bgColor={'tomato'}
        underlay={'transparent'}
        disabled={isLoadingDirections}
        style={`position: relative; right: 0; height: 40px; width: 40px`}
      />
    </Box>
  )
}
