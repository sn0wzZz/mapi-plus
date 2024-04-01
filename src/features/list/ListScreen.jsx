import { memo, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native'
import { openDatabase } from 'expo-sqlite'
import styled from 'styled-components/native'

import { useDarkMode } from '../../contexts/DarkModeContext'
import { useMapContext } from '../../contexts/MapContext'
import { useDbContext } from '../../contexts/DbContext'

import List from '../../ui/List'
import ButtonIcon from '../../ui/ButtonIcon'
import {
  AlertTemplate,
  deviceHeight,
  filterData,
  sortByDate,
} from '../../utils/helpers'
import CustomTabView from '../../ui/CustomTabView'

import useDeleteLocation from './useDeleteLocation'
import useGetAllLocations from './useGetAllLocations'
import ListOperations from './ListOperations'

import { useUserContext } from '../../contexts/UserContext'
import supabase from '../../services/supabase'
import { useListContext } from '../../contexts/ListContext'
import { Chat } from '../chat/Chat'
import useUser from '../authentication/useUser'
import { useRoute } from '@react-navigation/native'

const ListContainer = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.variant.backgroundSolid};
  height: 10px;
  flex-grow: 1;
  position: relative;
  justify-content: ${(props) => (props.align ? props.align : '')};
`

const locationRoutes = [
  { key: 'first', title: 'Online' },
  { key: 'second', title: 'Offline' },
]

export default function ListScreen({ navigation }) {
  const { selectedLocations, setSelectedLocations } = useListContext()
  const { variant } = useDarkMode()
  const { data, setPin, isLoading } = useMapContext()
  const { deleteOnlineLocations, isLoadingDel } = useDeleteLocation()
  const {
    filterValue,
    sorted,
    setUserMatchesVisible,
    userMatchesList,
    personalSort,
  } = useUserContext()
  const { createTable, deleteData, fetchData, deleteDataById } = useDbContext()
  const { onlineData, isLoading: isLoadingOnline } = useGetAllLocations()
  const [newOnlineData, setNewOnlineData] = useState([])
  let db = openDatabase('locationsDB.db')
  const {user} = useUser()

  useEffect(() => {
    setNewOnlineData(onlineData)
  }, [onlineData])

  useEffect(() => {
    const subscription = supabase
      .channel('locations_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'locations',
        },
        (payload) => {
          const newData = payload.new
          console.log('payload', newData)
          setNewOnlineData((old) => [...old, newData])
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'locations',
        },
        (payload) => {
          const newData = payload.old
          console.log('payload', newData)
          setNewOnlineData((oldLocations) => {
            const index = oldLocations.findIndex((l) => {
              console.log('l', l)
              l.id === newData.id
            })
            if (index !== -1) {
              const newLocations = [...oldLocations]
              newLocations.splice(index, 1)
              return newLocations
            } else {
              return oldLocations
            }
          })
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [onlineData])

  let filteredOnlineData = filterData(newOnlineData, filterValue, personalSort, user?.id )
  let sortedOnlineData = sortByDate(filteredOnlineData, sorted)

  let filteredData = filterData(data, filterValue)
  let sortedData = sortByDate(filteredData, sorted)

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
      'Delete selected locations',
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
    return setSelectedLocations([])
  }

  function displayUserMatches() {
    setUserMatchesVisible(true)
  }

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return (
          <List
            data={sortedOnlineData}
            actualData={onlineData}
            height={deviceHeight > 800 ? '80%' : '79%'}
            navigation={navigation}
            isLoading={isLoadingOnline}
          />
        )
      case 'second':
        return (
          <List
            data={sortedData}
            actualData={data}
            height={deviceHeight > 800 ? '80%' : '79%'}
            navigation={navigation}
            isLoading={isLoading}
          />
        )
      default:
        return null
    }
  }

  return (
    <ListContainer align={'center'} variant={variant}>
      <CustomTabView
        renderScene={renderScene}
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

      <ButtonIcon
        iconName={'people'}
        onPressFunction={displayUserMatches}
        top={'50px'}
        left
        color={variant.accent}
        bubble={userMatchesList?.length || '0'}
      />

      <ListOperations />
      {selectedLocations[0] && (
        <ButtonIcon
          iconName={'close'}
          onPressFunction={() => deselectItems()}
          bottom={'145px'}
          color={variant.text}
        />
      )}
    </ListContainer>
  )
}
