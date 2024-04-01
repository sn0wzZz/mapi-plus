import { Dimensions } from 'react-native'
import { Alert } from 'react-native'

export const deviceHeight = Dimensions.get('window').height
export const deviceWidth = Dimensions.get('window').width

export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function secondsToHoursMinutes(seconds) {
  const hours = Math.floor(seconds / 3600)
  const remainingSeconds = seconds % 3600
  const minutes = Math.floor(remainingSeconds / 60)
  const remainingSecondsFinal = remainingSeconds % 60

  const hoursString = hours > 0 ? `${hours} h` : ''
  const minutesString = minutes > 0 ? `${minutes} min` : ''
  const secondsString =
    remainingSecondsFinal > 0 ? `${remainingSecondsFinal} s` : ''

  if (seconds < 60) return secondsString
  return `${hoursString} ${minutesString}`.trim()
}

export function metersToKilometers(meters) {
  const kilometers = meters / 1000
  return `${kilometers.toFixed(2)} km`
}

export function AlertTemplate(title, question, fn) {
  Alert.alert(title, question, [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: fn,
    },
  ])
}

export const filterData = (data, filterValue, personal, userId) => {
  return data?.filter((location) => {
    if (filterValue === '*') {
      return !personal || location.publisher_id === userId
    } else if (filterValue === 'location 📍') {
      return (
        location.type === 'Location 📍' &&
        (!personal || location.publisher_id === userId)
      )
    } else if (filterValue === 'secret location 🔐') {
      return (
        location.type === 'secret location 🔐' &&
        (!personal || location.publisher_id === userId)
      )
    } else if (filterValue === 'parking 🚘') {
      return (
        location.type === 'parking 🚘' &&
        (!personal || location.publisher_id === userId)
      )
    } else if (filterValue === 'fitness & Health 💪') {
      return (
        location.type === 'fitness & Health 💪' &&
        (!personal || location.publisher_id === userId)
      )
    } else {
      return true
    }
  })
}


export const sortByDate = (data, sorted) => {
  const comparator = sorted
    ? (a, b) => new Date(a.created_at) - new Date(b.created_at)
    : (a, b) => new Date(b.created_at) - new Date(a.created_at)
  return data?.slice().sort(comparator)
}
