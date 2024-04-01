import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createMatch as createMatchApi } from '../../services/apiMatches'
import Toast from 'react-native-toast-message'

export default function useCreateMatch() {
  const queryClient = useQueryClient()

  const { mutate: createMatch, isLoading } = useMutation({
    mutationFn: createMatchApi,
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'New match initiated!',
        text2: 'You will be notified if the other user responds.',
        topOffset: 55,
      })
      queryClient.invalidateQueries({
        queryKey: ['matches'],
      })
    },
    onError: (error) =>
      Toast.show({
        type: 'error',
        text1: 'Match was not created!',
        text2: error.message,
      }),
  })
  return { createMatch, isLoading}
}
