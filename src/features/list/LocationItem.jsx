import { useRoute } from '@react-navigation/native'
import styled from 'styled-components/native'
import theme from '../../theme'
import { Keyboard, Text, TouchableHighlight, View } from 'react-native'

import { useMapContext } from '../../contexts/MapContext'
import { useDarkMode } from '../../contexts/DarkModeContext'

import useMapOperations from '../../utils/useMapOperations'

import Icon from 'react-native-vector-icons/Ionicons'
import useGeoCoding from '../../utils/useGeoCoding'
import { useListContext } from '../../contexts/ListContext'
import Toast from 'react-native-toast-message'
import useUser from '../authentication/useUser'

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
  background-color: ${(props) => props.variant.accent};
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
  setShowOnMapClicked,
  navigation,
  itemBg,
}) {
  const { variant } = useDarkMode()
  const { setPin, search, setSearch, setInputIsFocused, setDestination } =
    useMapContext()
  const { name: routeName } = useRoute()
  const { animateToSpecificLocation } = useMapOperations()
  const { getCoords } = useGeoCoding()
  const { user } = useUser()

  const { selectLocations, selectedLocations } = useListContext()

  const isPublishedByUser = item.publisher_id === user?.id

  const checkSelection = (id) => {
    if (isPublishedByUser || !item.publisher_id) return selectLocations(id)
    else
      Toast.show({
        type: 'error',
        text1: "You can't select this location!",
        text2: 'You can only select and delete locations added by you!',
        topOffset: 55,
      })
  }

  const locationPress = async (id, name, latitude, longitude) => {
    if (selectedLocations?.length) {
      return checkSelection(id)
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
    setPin({ locationPin, name, id })
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

  const selected = (id) => selectedLocations && selectedLocations.includes(id)

  return (
    <Item
      style={{ zIndex: 99 }}
      onPress={() =>
        locationPress(item.id, item.name, item.latitude, item.longitude)
      }
      onLongPress={() => checkSelection(item.id)}
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
                {item.type === 'location' && (
                  <Icon name={'locate'} size={15} color={variant.accent} />
                )}{' '}
              </Title>
              {item.type && (
                <Type variant={variant}>
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
                    color: variant.text,
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
                item.type ? theme.colors.accentSecondary : theme.colors.accent
              }
            />
          </Row>
        </Content>
        {selected(item.id) && <Overlay variant={variant} />}
      </View>
    </Item>
  )
}
