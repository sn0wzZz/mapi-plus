import { useEffect } from 'react'
import useGetProfileIdsFromLocation from '../features/map/useGetProfileIdsFromLocation'
import useGetProfilesByIds from '../features/profiles/useGetProfileByIds'
import { useUserContext } from '../contexts/UserContext'

import { useDarkMode } from '../contexts/DarkModeContext'
import { Text, View } from 'react-native'
import { Callout, Marker } from 'react-native-maps'
import { Image } from 'expo-image'
import styled from 'styled-components'
import theme from '../theme'
import Icon from 'react-native-vector-icons/Ionicons'

const StyledTooltip = styled(View)`
  background-color: ${(props) => props.variant.background};
  border-radius: ${theme.radiuses.sm};
  width: 145px;
  height: 85px;
  padding: 8px;
  margin-bottom: 5px;
  gap: 5px;
`

export default function Pin({
  color,
  coordinate,
  name,
  iconName,
  iconSize,
  locationId,
}) {
  const { variant } = useDarkMode()
  const { setProfileList } = useUserContext()
  const { data: profileIds } = useGetProfileIdsFromLocation(locationId)
  const { data: profiles } = useGetProfilesByIds(profileIds)

  useEffect(() => {
    profiles && setProfileList(profiles)
  }, [profiles])

  // console.log(profileIds)

  return (
    <Marker
      coordinate={coordinate}
      pinColor={color}
      style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}
    >
      {iconName && <Icon name={iconName} size={iconSize} color={color} />}
      <Callout tooltip>
        <StyledTooltip color={color} variant={variant}>
          {name && (
            <Text style={{ color: color, fontWeight: 'bold', fontSize: 18 }}>
              {name}
            </Text>
          )}

          {!profiles?.length && (
            <Text
              style={{
                color,
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Hasn't been visited...
            </Text>
          )}

          {profiles ? (
            <View style={{ display: 'flex', flexDirection: 'row' }}>
              {profiles[0]?.avatar && (
                <View
                  style={{
                    width: 40,
                    borderRadius: 99,
                    overflow: 'hidden',
                    zIndex: 3,
                    borderWidth: 2,
                    borderColor: color,
                  }}
                >
                  <Image
                    style={{ width: '100%', aspectRatio: 1, borderRadius: 99 }}
                    source={profiles[0]?.avatar || ''}
                  />
                </View>
              )}
              {profiles[1]?.avatar && (
                <View
                  style={{
                    width: 40,
                    borderRadius: 99,
                    overflow: 'hidden',
                    zIndex: 2,
                    transform: [{ translateX: -20 }],
                  }}
                >
                  <Image
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                      borderRadius: 99,
                      borderWidth: 2,
                      borderColor: color,
                    }}
                    source={profiles[1]?.avatar || ''}
                  />
                </View>
              )}
              {profiles[2]?.avatar && (
                <View
                  style={{
                    width: 40,
                    borderRadius: 99,
                    overflow: 'hidden',
                    zIndex: 1,
                    transform: [{ translateX: -40 }],
                  }}
                >
                  <Image
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                      borderRadius: 99,
                      borderWidth: 2,
                      borderColor: color,
                    }}
                    source={profiles[2]?.avatar || ''}
                  />
                </View>
              )}
              {profiles.length - 3 > 0 && (
                <View
                  style={{
                    width: 40,
                    zIndex: 1,
                    transform: [{ translateY: 8 }, { translateX: -35 }],
                  }}
                >
                  <Text
                    style={{
                      color: color,
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}
                  >
                    +{profiles.length - 3}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <Text
              style={{
                color: variant.textSecondary,
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 'bold',
                transform: [{ translateY: 6 }],
              }}
            >
              Loading...
            </Text>
          )}
          <Icon
            name='chevron-forward'
            color={color}
            size={30}
            style={{ position: 'absolute', right: 0, top: '40%' }}
          />
        </StyledTooltip>
      </Callout>
    </Marker>
  )
}
