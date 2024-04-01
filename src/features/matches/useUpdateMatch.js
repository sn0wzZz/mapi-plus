import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateMatch as updateMatchApi } from '../../services/apiMatches'
import Toast from 'react-native-toast-message'

export default function useUpdateMatch() {
  const queryClient = useQueryClient()

  const { mutate: updateMatch, isLoading: isEditing } = useMutation({
    mutationFn: ({id, updatedMatch})=>updateMatchApi(id,updatedMatch),
    onSuccess: () => {
      Toast.show({
        type: 'success',
        text1: 'New match!',
        text2: 'You can see your new match in mathces.',
        topOffset:55
      })
      queryClient.invalidateQueries({
        queryKey: ['matches'],
      })
    },
    onError: (error) =>
      Toast.show({
        type: 'error',
        text1: 'Match was not updated!',
        text2: error.message,
      }),
  })

  return { isEditing, updateMatch }
}
