import { FlatList, SafeAreaView, View } from 'react-native'
import styled from 'styled-components'

import LocationItem from '../features/list/LocationItem'
import theme from '../theme'

import Spinner from './Spinner'
import ListError from './ListError'
import { useListContext } from '../contexts/ListContext'
import { useMapContext } from '../contexts/MapContext'


const StyledList = styled(FlatList)`
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
  actualData,
  topOffset,
  height,
  zIndex,
  navigation,
  itemBg,
  setShowOnMapClicked,
  isLoading,
}) {
  const { selectedLocations } = useListContext()
  const { searchResult } = useMapContext()

  if (isLoading)
    return (
      <SafeAreaView
        style={{
          height: '80%',
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Spinner size={'large'} />
      </SafeAreaView>
    )

  if (!actualData.length && !searchResult)
    return (
      <ListError
        iconName='warning'
        message='No local data'
        subMessage='Add a marker! '
      />
    )

  if (!isLoading && !data?.length)
    return (
      <ListError
        iconName='close'
        message='No match found'
        subMessage='No such location or of this type! '
      />
    )

  return (
    <StyledList
      topOffset={topOffset}
      height={height}
      zIndex={zIndex}
      style={{ flex: 1 }}
      keyboardShouldPersistTaps='handled'
      data={data?.slice().reverse()}
      renderItem={({ item }) => {
        return (
          <LocationItem
            item={item}
            itemBg={itemBg}
            setShowOnMapClicked={setShowOnMapClicked}
            navigation={navigation}
          />
        )
      }}
      keyExtractor={(item) => item.id}
      extraData={selectedLocations}
    />
  )
}
