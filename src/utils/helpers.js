import { Dimensions } from 'react-native'
import { Alert } from 'react-native'

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


export const deviceHeight = Dimensions.get('window').height
export const deviceWidth = Dimensions.get('window').width

export function AlertTemplate(title, question, onPress) {
  Alert.alert(title, question, [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: onPress,
    },
  ])
}