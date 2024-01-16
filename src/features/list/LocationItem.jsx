import { useRoute } from '@react-navigation/native'
import styled from 'styled-components/native'
import theme from '../../theme'
import { Keyboard, Text, TouchableHighlight, View } from 'react-native'

import { useMapContext } from '../../contexts/MapContext'
import { useDarkMode } from '../../contexts/DarkModeContext'

import useMapOperations from '../../utils/useMapOperations'

import Icon from 'react-native-vector-icons/Ionicons'
import useGeoCoding from '../../utils/useGeoCoding'

const Row = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
`

const Item = styled(TouchableHighlight)`
  margin-bottom: 10px;
  overflow: hidden;
  border-radius: ${theme.radiuses.md};
  background-color: ${(props) =>
    props.itemBg ? props.itemBg : props.variant.listItem};
`
const ItemHeader = styled(View)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`
const Title = styled(Text)`
  color: ${theme.colors.accent};
  font-weight: bold;
  font-size: 18px;
`
const Type = styled(Text)`
  color: black;
  font-weight: bold;
  background-color: ${theme.colors.accent};
  margin-left: auto;
  padding: 2.5px 10px;
  border-radius: ${theme.radiuses.full};
`

const Content = styled(View)`
  width: 100%;
  padding: 20px;
  position: relative;
`

const Overlay = styled(View)`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.variant.overlay};
  top: 0;
  left: 0;
`

const Span = styled(Text)`
  margin-top: 10px;
  color: ${(props) => props.variant.textSecondary};
  font-size: 14px;
`

export default function LocationItem({
  item,
  selectedLocations,
  setSelectedLocations,
  setShowOnMapClicked,
  navigation,
  itemBg,
}) {
  const { variant } = useDarkMode()
  const {
    setPin,
    vibrate,
    search,
    setSearch,
    setInputIsFocused,
    setDestination,
  } = useMapContext()
  const { name: routeName } = useRoute()
  const { animateToSpecificLocation } = useMapOperations()
  const { getCoords } = useGeoCoding()

  // console.log(item)

  const pressHandler = async (id, name, latitude, longitude) => {
    if (selectedLocations?.length) {
      return selectLocations(id)
    }
    if (!longitude || !latitude) {
      const coords = await getCoords(name)
      const {
        0: {
          location: { lat, lng },
        },
      } = { ...coords }

      setPin({ locationPin: { latitude: lat, longitude: lng }, name: 'Search' })
      setDestination({ latitude: lat, longitude: lng })
      animateToSpecificLocation({ latitude: lat, longitude: lng })
      setSearch(null)
      Keyboard.dismiss()
      return
    }
    latitude = parseFloat(latitude)
    longitude = parseFloat(longitude)
    let locationPin = { latitude, longitude }
    setPin({ locationPin, name })
    setDestination({ latitude: latitude, longitude: longitude })
    if (setInputIsFocused) setInputIsFocused(false)
    if (setShowOnMapClicked) setShowOnMapClicked(true)
    animateToSpecificLocation(locationPin)
    if (routeName === 'List') navigation.navigate('Map')
    if (search) {
      setSearch(null)
      Keyboard.dismiss()
    }
  }

  const selectLocations = (id) => {
    vibrate()
    if (selectedLocations.includes(id)) {
      const newListItem = selectedLocations.filter(
        (locationId) => locationId !== id
      )
      return setSelectedLocations(newListItem)
    }
    setSelectedLocations([...selectedLocations, id])
  }

  const selected = (id) => selectedLocations && selectedLocations.includes(id)

  return (
    <Item
      style={{ zIndex: 99 }}
      onPress={() =>
        pressHandler(item.id, item.name, item.latitude, item.longitude)
      }
      onLongPress={() => selectedLocations && selectLocations(item.id)}
      variant={variant}
      itemBg={itemBg}
      underlayColor={variant.underlay}
    >
      <View>
        <Content>
          {item.name && (
            <ItemHeader>
              <Title>
                {item.name}{' '}
                {item.type==='location'&&<Icon name={'locate'} size={15} color={theme.colors.accent} />}{' '}
              </Title>
              {item.type && (
                <Type>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Type>
              )}
            </ItemHeader>
          )}
          <Row>
            <View
              style={{
                flex: 1,
              }}
            >
              {item.info && (
                <Text
                  style={{
                    color: variant.textWhite,
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  {item.info}
                </Text>
              )}
              {item.latitude && item.longitude && (
                <Span variant={variant}>
                  Latitude: {String(item.latitude)} {'\n'}
                  Longitude: {String(item.longitude)}
                </Span>
              )}
            </View>
            <Icon
              name={item.type ? 'location' : 'search'}
              size={25}
              color={
                item.type ? theme.colors.secondaryAccent : theme.colors.accent
              }
            />
          </Row>
        </Content>
        {selected(item.id) && <Overlay variant={variant} />}
      </View>
    </Item>
  )
}
