import { createContext, useContext, useState } from 'react'
import { useMapContext } from './MapContext'

const ListContext = createContext()

function ListContextProvider({ children }) {
  const { vibrate } = useMapContext()
  const [selectedLocations, setSelectedLocations] = useState([])

  const selectLocations = (id) => {
    vibrate()
    if (selectedLocations?.includes(id)) {
      setSelectedLocations((prevIds) =>
        prevIds.filter((itemId) => itemId !== id)
      )
    } else {
      setSelectedLocations((prevIds) => [...prevIds, id])
    }
  }

  return (
    <ListContext.Provider
      value={{ selectLocations, selectedLocations, setSelectedLocations }}
    >
      {children}
    </ListContext.Provider>
  )
}
function useListContext() {
  const context = useContext(ListContext)
  if (context === undefined)
    throw new Error('ListContext was used outside of ListContextProvider')
  return context
}
export { ListContextProvider, useListContext }
