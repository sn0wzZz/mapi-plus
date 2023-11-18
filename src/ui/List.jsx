import { FlatList, View} from 'react-native'
import styled from 'styled-components'

import LocationItem from '../features/list/LocationItem'
import theme from '../theme'

const StyledList = styled(View)`
  flex: 1;
  z-index: ${(props) => props.zIndex || 1};
  /* height: max-content; */
  height: ${(props) => props.height};
  overflow: scroll;
  width: 95%;
  max-width: 500px;
  position: absolute;
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
}) {
  return (
    <StyledList topOffset={topOffset} height={height} zIndex={zIndex}>
      <FlatList
        keyboardShouldPersistTaps='handled'
        idExtractor={(item) => item.id}
        data={data.slice().reverse()}
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
