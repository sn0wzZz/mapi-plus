import { Text, SafeAreaView } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import styled from 'styled-components';
import theme from '../theme';

import { useDarkMode } from '../contexts/DarkModeContext';

import Icon from 'react-native-vector-icons/Ionicons'

const StyledTooltip = styled(SafeAreaView)`
  background-color: ${props=> props.variant.background};
  border-radius: ${theme.radiuses.sm};
  padding: 8px;
  /* border-width: 1px; */
  /* border-color: ${(props) => props.color || none}; */
  margin-bottom: 5px;
  position: relative;
`


export default function Pin({ color, coordinate, name, iconName, iconSize}) {
  const { variant } = useDarkMode()
  return (
    <Marker
      coordinate={coordinate}
      pinColor={color}
      style={{ flex: 1, flexDirection: 'row' }}
    >
      {iconName && <Icon name={iconName} size={iconSize} color={color} />}
      <Callout tooltip>
        <StyledTooltip color={color} variant={variant}>
          {name && (
            <Text style={{ color: color, fontWeight: 'bold', fontSize: 18 }}>
              {name}
            </Text>
          )}
          <Text style={{ color: color, fontSize: 18 }}>
            {String(coordinate.latitude).slice(0, 7)}/
            {String(coordinate.longitude).slice(0, 7)}
          </Text>
        </StyledTooltip>
      </Callout>
    </Marker>
  )
}
