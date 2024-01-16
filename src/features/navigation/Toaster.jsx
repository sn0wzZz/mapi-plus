import { View } from 'react-native';
import { useDarkMode } from '../../contexts/DarkModeContext';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message'

export default function Toaster({ props }) {
  const {variant} = useDarkMode()
  return (
    <View
      style={{
        zIndex: 1000,
        position: 'absolute',
        top: 10,
        left: 0,
        right: 0,
      }}
    >
      <Toast
        config={{
          success: (props) => (
            <BaseToast
              {...props}
              duration={4000}
              style={{
                borderRightWidth: 5,
                borderLeftWidth: 5,
                borderColor: variant.secondaryAccent,
                backgroundColor: variant.background,
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
          error: (props) => (
            <ErrorToast
              {...props}
              style={{
                borderRightWidth: 5,
                borderLeftWidth: 5,
                borderColor: variant.error,
                backgroundColor: variant.background,
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
    </View>
  )
}