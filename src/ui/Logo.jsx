import { Image, Text, View } from 'react-native'

export default function Logo({ logo }) {
  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: 0,
        position: 'relative',
        marginVertical: 30,
      }}
    >
      <Image
        source={logo}
        style={{
          height: 200,
          width: 200,
        }}
      />
      <Text
        style={{
          fontSize: 40,
          color: theme.colors.accent,
          position: 'absolute',
          margin: 'auto',
          bottom: 0,
        }}
      >
        mapi
      </Text>
    </View>
  )
}
