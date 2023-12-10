
import { Alert } from 'react-native'
export default function AlertTemplate(title,question,onPress) {
    Alert.alert(
      title,
      question,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: onPress,
        },
      ]
    )
}