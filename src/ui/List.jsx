import { FlatList, SafeAreaView, Text, View } from 'react-native'
import styled from 'styled-components'

import LocationItem from '../features/list/LocationItem'
import theme from '../theme'
import Spinner from 'react-native-loading-spinner-overlay'
import { useDarkMode } from '../contexts/DarkModeContext'
import Icon from 'react-native-vector-icons/Ionicons'

const StyledList = styled(View)`
  flex: 1;
  z-index: ${(props) => props.zIndex || 1};
  height: ${(props) => props.height || '100%'};
  overflow: scroll;
  width: 95%;
  max-width: 500px;
  position: absolute;
  align-self: center;
  top: ${(props) => props.topOffset};
  border-radius: ${theme.radiuses.md};
`

export default function List({
  data,
  topOffset,
  height,
  zIndex,
  selectedLocations,
  setSelectedLocations,
  navigation,
  itemBg,
  setShowOnMapClicked,
  isLoading,
}) {
  // console.log('Number of items:', data.length)
  // console.log('Height:', height)

  const { variant } = useDarkMode()
  if (data&&!data[0])
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
        <Text style={{ color: theme.colors.accent, fontSize: 30 }}>
          No data {<Icon name={'warning'} size={30} color={variant.accent} />}
        </Text>
        <Text
          style={{
            color: variant.textWhite,
            width: '100%',
            textAlign: 'center',
          }}
        >
          Add a marker!
        </Text>
      </SafeAreaView>
    )
  
  if (isLoading)
    return (
      <SafeAreaView>
        <Spinner visible={isLoading} color={theme.colors.accent} />
      </SafeAreaView>
    )
    


  return (
    <StyledList topOffset={topOffset} height={height} zIndex={zIndex}>
      <FlatList
        style={{ flex: 1 }}
        keyboardShouldPersistTaps='handled'
        idExtractor={(item) => item.id}
        data={data?.slice()?.reverse()}
        renderItem={({ item }) => {
          return (
            <LocationItem
              key={item.id}
              item={item}
              itemBg={itemBg}
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              setShowOnMapClicked={setShowOnMapClicked}
              navigation={navigation}
            />
          )
        }}
      />
    </StyledList>
  )
}
