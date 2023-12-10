import { FlatList, Text, View} from 'react-native'
import styled from 'styled-components'

import LocationItem from '../features/list/LocationItem'
import theme from '../theme'
import { useDarkMode } from '../contexts/DarkModeContext'

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
const StyledText = styled(Text)`
  font-weight: bold;
  color: ${props=>props.variant.textWhite};
  width: 100%;
  padding-bottom: 10px;
  margin-left: 15px;
`

export default function List({
  dataSort = true,
  data,
  topOffset,
  height,
  zIndex,
  selectedLocations,
  setSelectedLocations,
  navigation,
  itemBg,
  setShowOnMapClicked,
  text
}) {
  const {variant} = useDarkMode()
  return (
    <StyledList topOffset={topOffset} height={height} zIndex={zIndex}>
      {data.length > 0 && <StyledText variant={variant}>{text}</StyledText>}
      <FlatList
        keyboardShouldPersistTaps='handled'
        idExtractor={(item) => item.id}
        data={dataSort ? data?.slice()?.reverse() : data}
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
