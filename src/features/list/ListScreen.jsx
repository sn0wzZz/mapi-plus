import React, { useEffect, useState } from 'react'
import {  Text, Alert, SafeAreaView } from 'react-native'
import { openDatabase } from 'expo-sqlite'
import styled from 'styled-components/native'
import theme from '../../theme'

import { useDarkMode } from '../../contexts/DarkModeContext'
import { useMapContext } from '../../contexts/MapContext'
import { useDbContext } from '../../contexts/DbContext'

import Spinner from 'react-native-loading-spinner-overlay'
import List from '../../ui/List'
import Icon from 'react-native-vector-icons/Ionicons'
import ButtonIcon from '../../ui/ButtonIcon'

const ListContainer = styled(SafeAreaView)`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.variant.backgroundSolid};
  height: 10px;
  flex-grow: 1;

  justify-content: ${(props) => (props.align ? props.align : '')};
`

const Header = styled(Text)`
  background-color: ${theme.colors.accent};
  color: black;
  font-weight: bold;
  border-radius: ${theme.radiuses.lg};
  padding-horizontal: 10px;
  margin: 30px;
  font-size: 16px;
`

export default function ListScreen({ navigation }) {
  const [selectedLocations, setSelectedLocations] = useState([])
  const { variant } = useDarkMode()
  const { marker, data, setPin, isLoading } = useMapContext()

  const { createTable, deleteData, fetchData, deleteDataById } = useDbContext()

  let db = openDatabase('locationsDB.db')


  useEffect(() => {
    fetchData()
  }, [marker])

  const DeleteLocationAlert = () =>
    Alert.alert('Delete all locations', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          deleteData()
          setPin(null)
          fetchData()
        },
      },
    ])

  const EmptyDBAlert = () =>
    Alert.alert('Recreate the DB', 'Are you sure?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setPin(null)
          db.closeAsync()
          db.deleteAsync()
          db = openDatabase('locationsDB.db')
          createTable()
          fetchData()
        },
      },
    ])

  const DeleteLocationsByIdAlert = (ids) =>
    Alert.alert(
      'Delete selected locations locations',
      `Are you sure you want to delete ${ids.length === 1 ? 'this' : 'these'} ${
        ids.length === 1 ? '' : ids.length
      } ${ids.length === 1 ? 'location' : 'locations'}?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            console.log(ids)
            setPin(null)
            deselectItems()
            ids.forEach((id) => {
              deleteDataById(id)
            })
            await fetchData()
          },
        },
      ]
    )
  const deleteLocations = () => {
    selectedLocations[0]
      ? DeleteLocationsByIdAlert(selectedLocations)
      : DeleteLocationAlert()
  }

  function deselectItems() {
    console.log('click')
    return setSelectedLocations([])
  }

  if (isLoading)
    return (
      <ListContainer align={'center'} variant={variant}>
        <Spinner visible={isLoading} color={theme.colors.accent} />
      </ListContainer>
    )

  if (!data[0])
    return (
      <ListContainer align={'center'} variant={variant}>
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
      </ListContainer>
    )

  return (
    <ListContainer variant={variant}>
      <Header>Locations</Header>
      <List
        data={data}
        topOffset='80px'
        height='77%'
        selectedLocations={selectedLocations}
        setSelectedLocations={setSelectedLocations}
        navigation={navigation}
      />

      <ButtonIcon
        iconName={'trash'}
        onPressFunction={deleteLocations}
        onLongPressFunction={() => EmptyDBAlert()}
        top={'670px'}
        color={'tomato'}
      />
      {selectedLocations[0] && (
        <ButtonIcon
          iconName={'close'}
          onPressFunction={() => deselectItems()}
          top={'600px'}
          color={variant.textWhite}
        />
      )}
    </ListContainer>
  )
}
