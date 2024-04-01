import { View } from 'react-native'
import { useDarkMode } from '../../contexts/DarkModeContext'
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

import Icon from 'react-native-vector-icons/Ionicons'

export default function Toaster({ props }) {
  const { variant } = useDarkMode()
  return (
    <Toast
      config={{
        success: (props) => (
          <BaseToast
            {...props}
            duration={4000}
            style={{
              borderRightWidth: 5,
              borderLeftWidth: 5,
              borderColor: variant.accentSecondary,
              backgroundColor: variant.underlaySolid,
              borderRadius: 20,
              elevation: 0,
            }}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            text1Style={{
              fontSize: 15,
              color: variant.accent,
              fontWeight: '400',
            }}
            text2Style={{
              color: variant.textSecondary,
            }}
          />
        ),
        confirm: (props) => (
          <BaseToast
            {...props}
            duration={60000}
            style={{
              zIndex: 9999,
              borderRightWidth: 5,
              borderLeftWidth: 5,
              borderColor: variant.accent,
              backgroundColor: variant.underlaySolid,
              borderRadius: 20,
              elevation: 0,
              height: 80,
            }}
            contentContainerStyle={{
              paddingHorizontal: 15,
            }}
            text1Style={{
              fontSize: 18,
              color: variant.accent,
              fontWeight: 'bold',
            }}
            text2Style={{
              fontSize: 15,
              color: variant.textSecondary,
            }}
            renderTrailingIcon={() => (
              <View
                style={{
                  width: 90,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon name={'golf'} size={40} color={variant.accent} />
              </View>
            )}
          />
        ),
        error: (props) => (
          <ErrorToast
            {...props}
            style={{
              zIndex: 9999,
              borderRightWidth: 5,
              borderLeftWidth: 5,
              borderColor: variant.error,
              backgroundColor: variant.underlaySolid,
              borderRadius: 20,
              elevation: 0,
            }}
            text1Style={{
              fontSize: 15,
              color: variant.accent,
              fontWeight: '400',
            }}
            text2Style={{
              color: variant.error,
            }}
          />
        ),
      }}
    />
    // </View>
  )
}
