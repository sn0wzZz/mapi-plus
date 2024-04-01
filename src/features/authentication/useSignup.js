import { useMutation } from '@tanstack/react-query'
import { signup as signupApi } from '../../services/apiAuth'
import Toast from 'react-native-toast-message'

export function useSignup() {
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      console.log('New user:',user)
      Toast.show({
        type: 'success',
        text1: 'Account sucessfuly created!',
        text2: 'Please verify the new account via email.',
      })
    },
    onError: (error) => {
      console.log(error)
      Toast.show({
        type: 'success',
        text1: 'Account sucessfuly created!',
        text2: 'Please verify the new account via email.',
      })
    },
  })

  return {signup, isLoading}
}
