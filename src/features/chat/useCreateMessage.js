import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMessage as createMessageApi } from '../../services/apiChats'
import Toast from 'react-native-toast-message'

export default function useCreateMessage() {
  const queryClient = useQueryClient()

  const { mutate: createMessage, isLoading } = useMutation({
    mutationFn: createMessageApi,
    onError: (error) =>
      Toast.show({
        type: 'error',
        text1: 'Chat was not created!',
        text2: error.message,
        topOffset: 55,
      }),
  })
  return { createMessage, isLoading }
}
