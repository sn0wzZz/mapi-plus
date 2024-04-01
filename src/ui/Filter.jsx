import { FlatList } from 'react-native'

import { items } from '../misc'
import ButtonText from './ButtonText'
import { useUserContext } from '../contexts/UserContext'

const newItems = [{ label: 'All Locations', value: '*' }, ...items]

export default function Filter() {
  const { filterValue, setFilterValue } = useUserContext()

  const handleFilter = (value) => {
    setFilterValue(value)
  }

  return (
    <FlatList
      scrollIndicatorInsets={200}
      horizontal
      data={newItems}
      renderItem={({ item }) => (
        <ButtonText
          key={item.value}
          variant='primary'
          onPressFunction={() => handleFilter(item.value)}
          size={40}
          fontSize={14}
          active={filterValue === item.value}
          style={'padding-horizontal: 2px; margin-right:4px; margin-left:0;'}
        >
          {item.label}
        </ButtonText>
      )}
    />
  )
}
