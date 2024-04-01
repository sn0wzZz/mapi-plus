import { SafeAreaView, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { useDarkMode } from '../contexts/DarkModeContext'

export default function ListError({ iconName, message, subMessage }) {
  const { variant } = useDarkMode()
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: '50%' }}>
      <View
        style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
      >
        <Text
          style={{
            color: theme.colors.accent,
            fontSize: 30,
            alignItems: 'center',
          }}
        >
          {message}{' '}
        </Text>
        <Icon name={iconName} size={35} color={variant.accent} />
      </View>
      <Text
        style={{
          color: variant.text,
          width: '100px',
          textAlign: 'center',
        }}
      >
        {subMessage}
      </Text>
    </SafeAreaView>
  )
}
