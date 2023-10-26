import { FlatList, View} from 'react-native'
import styled from 'styled-components'

import LocationItem from '../features/list/LocationItem'

const StyledList = styled(View)`
  flex: 1;
  z-index: ${(props) => props.zIndex || 1 };
  /* height: max-content; */
  height: ${(props) => props.height};
  overflow: scroll;
  width: 95%;
  max-width: 500px;
  position: absolute;
  top: ${(props) => props.topOffset};
`

export default function List({ data, topOffset, height, zIndex, selectedLocations, setSelectedLocations ,navigation, itemBg }) {
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
              navigation={navigation}
            />
          )
        }}
      />
    </StyledList>
  )
}
