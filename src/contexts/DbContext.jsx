import { createContext, useContext } from 'react'

import { openDatabase } from 'expo-sqlite'
import { useMapContext } from './MapContext'

const db = openDatabase('locationsDB.db')

const DbContext = createContext()

function DbProvider({ children }) {
  const { setData, setIsLoading, setParkingLocation } = useMapContext()

  //Creates tables
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, latitude TEXT, longitude TEXT);
        `,
        (_, results) => {
          console.log('Successfully created locations table', results.rows)
        }
        // (_, error) => console.error('error ct', error)
      )
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS parking (id INTEGER PRIMARY KEY, latitude TEXT, longitude TEXT);
        `,
        (_, results) => {
          console.log('Successfully created locations table', results.rows)
        }
        // (_, error) => console.error('error ct', error)
      )
    })
  }

  //Insert
  const insertData = (name, type, latitude, longitude) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO locations (name, type, latitude, longitude) VALUES (?, ?, ?, ?);',
        [name, type, latitude, longitude],
        (_, results) => {
          console.log('Successfully inserted', results.rowsAffected)
        },
        (_, error) => console.error('error insert', error)
      )
    })
  }

  // Inserts where you parked your car
  const insertParkingData = (latitude, longitude) => {
    db.transaction((tx) => {
      tx.executeSql(
        `INSERT OR REPLACE INTO parking (id, latitude, longitude) VALUES (?, ?, ?);`,
        [1, latitude, longitude],
        (_, { rowsAffected }) => {
          if (rowsAffected > 0) console.log('Sucessfully inserted parking')
        },
        (_, error) => {
          console.error('Error executing SQL statement', error)
        }
      )
    })
    //if a record exists update it
    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `UPDATE parking SET latitude = ${latitude} longitude = ${longitude} WHERE id = 1;`,
    //     [latitude, longitude],
    //     (_, results) => {
    //       console.log('Successfully updated parking', results.rowsAffected)
    //     },
    //     (_, error) => console.error('error insert', error)
    //   )
    // })
  }

  // Fetchs saved locations
  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM locations',
        [],
        (_, results) => {
          const rows = results.rows
          const len = rows.length
          const newData = []

          for (let i = 0; i < len; i++) {
            const row = rows.item(i)
            newData.push(row)
          }

          setData(newData)
          setIsLoading(false)
          // console.log('latest data', data)
        },
        (_, error) => console.error('error fetch', error)
      )
    })
  }

  // Fetches whare yo parked your car
  const fetchParkingData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM parking',
        [],
        (_, results) => {
          const latitude = parseFloat(results.rows._array.at(0).latitude)
          const longitude = parseFloat(results.rows._array.at(0).longitude)
          const newParked = { latitude: latitude, longitude: longitude }

          setParkingLocation(newParked)
          setIsLoading(false)
          console.log(results.rows._array)
        },
        (_, error) => console.error('error fetch', error)
      )
    })
  }

  // Delete by ID
  const deleteDataById = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM locations WHERE id=${id}`,
        (_, results) => console.log('Success delete by id', results.rows)
        // (_, error) => console.error('error delete', error)
      )
    })
  }

  // Delete ALL locations from the database
  const deleteData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE * FROM locations',
        (_, results) => console.log('Success delete', results.rows)
        // (_, error) => console.error('error delete', error)
      )
    })
  }

  return (
    <DbContext.Provider
      value={{
        createTable,
        insertData,
        fetchData,
        insertParkingData,
        fetchParkingData,
        deleteData,
        deleteDataById,
      }}
    >
      {children}
    </DbContext.Provider>
  )
}
function useDbContext() {
  const context = useContext(DbContext)
  if (context === undefined)
    throw new Error('DbContext was used outside of DbContextProvider')
  return context
}
export { DbProvider, useDbContext }
