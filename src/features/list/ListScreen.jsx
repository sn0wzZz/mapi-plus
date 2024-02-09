import { useEffect, useState } from 'react'
import { Text, SafeAreaView } from 'react-native'
import { openDatabase } from 'expo-sqlite'
import styled from 'styled-components/native'
import theme from '../../theme'

import { useDarkMode } from '../../contexts/DarkModeContext'
import { useMapContext } from '../../contexts/MapContext'
import { useDbContext } from '../../contexts/DbContext'

import List from '../../ui/List'
import ButtonIcon from '../../ui/ButtonIcon'
import { AlertTemplate } from '../../utils/helpers'
import CustomTabView from '../../ui/CustomTabView'
import { SceneMap } from 'react-native-tab-view'
import { getLocations } from '../../services/apiLocations'

import { useQuery } from '@tanstack/react-query'
import { useIsFocused } from '@react-navigation/native'
import useDeleteLocation from './useDeleteLocation'
import Logout from '../authentication/Logout'

const ListContainer = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.variant.backgroundSolid};
  height: 10px;
  flex-grow: 1;
  justify-content: ${(props) => (props.align ? props.align : '')};
`

const Header = styled(Text)`
  top: 40px;
  background-color: ${theme.colors.accent};
  color: black;
  font-weight: bold;
  border-radius: ${theme.radiuses.lg};
  padding-horizontal: 10px;
  margin: 30px;
  font-size: 16px;
`

const locationRoutes = [
  { key: 'first', title: 'Online' },
  { key: 'second', title: 'Offline' },
]

export default function ListScreen({ navigation }) {
  const [selectedLocations, setSelectedLocations] = useState([])
  const { variant } = useDarkMode()
  const { marker, data, setPin, isLoading } = useMapContext()
  const {deleteOnlineLocations, isLoadingDel} = useDeleteLocation()

  const { createTable, deleteData, fetchData, deleteDataById } = useDbContext()

  const isFocused = useIsFocused()

  let db = openDatabase('locationsDB.db')
  
  const {
    error,
    data: onlineData,
    isLoading: isLoadingOnline,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: getLocations,
    enabled: isFocused,
  })
  
  useEffect(() => {
    fetchData()
  }, [marker])

  const deleteAllLocations = () => {
    deleteData()
    setPin(null)
    fetchData()
  }
  const emptyDb = () => {
    setPin(null)
    db.closeAsync()
    db.deleteAsync()
    db = openDatabase('locationsDB.db')
    createTable()
    fetchData()
  }
  const deleteLocationsById = async (ids) => {
    // console.log(ids)
    setPin(null)
    deselectItems()
    ids.forEach((id) => {
      deleteDataById(id)
    })
    await fetchData()
  }

  const DeleteLocationAlert = () =>
    AlertTemplate('Delete all locations', 'Are you sure?', deleteAllLocations)

  const EmptyDBAlert = () =>
    AlertTemplate('Recreate the DB', 'Are you sure?', emptyDb)

  const DeleteLocationsByIdAlert = (ids) =>
    AlertTemplate(
      'Delete selected locations locations',
      `Are you sure you want to delete ${ids.length === 1 ? 'this' : 'these'} ${
        ids.length === 1 ? '' : ids.length
      } ${ids.length === 1 ? 'location' : 'locations'}?`,
      async () => (await deleteLocationsById(ids)) || deleteOnlineLocations(ids)
    )

  const deleteLocations = () => {
    selectedLocations[0]
      ? DeleteLocationsByIdAlert(selectedLocations)
      : DeleteLocationAlert()
  }

  function deselectItems() {
    // console.log('click')
    return setSelectedLocations([])
  }

  return (
    <ListContainer align={'center'} variant={variant}>
      {/* <Header>Locations</Header> */}

      <CustomTabView
        renderScene={SceneMap({
          first: () => (
            <List
              data={onlineData}
              height='86%'
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              navigation={navigation}
              isLoading={isLoadingOnline}
            />
          ),
          second: () => (
            <List
              data={data}
              height='86%'
              selectedLocations={selectedLocations}
              setSelectedLocations={setSelectedLocations}
              navigation={navigation}
              isLoading={isLoading}
            />
          ),
        })}
        tabRoutes={locationRoutes}
        position='top'
        marginTop={60}
        width={134.5}
      />

      <ButtonIcon
        iconName={'trash'}
        onPressFunction={deleteLocations}
        onLongPressFunction={EmptyDBAlert}
        bottom={'20px'}
        color={variant.error}
        disabled={isLoadingDel}
        isLoading={isLoadingDel}
      />

      {selectedLocations[0] && (
        <ButtonIcon
          iconName={'close'}
          onPressFunction={() => deselectItems()}
          bottom={'90px'}
          color={variant.textWhite}
        />
      )}
    </ListContainer>
  )
}
