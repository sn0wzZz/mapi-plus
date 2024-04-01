import { useMutation, useQueryClient } from '@tanstack/react-query'
import Toast from 'react-native-toast-message'
import { deleteMatch as deleteMatchApi } from '../../services/apiMatches'

export default function useDeleteMatch() {
  const queryClient = useQueryClient()
  const { mutate: deleteMatch, isPending: isLoadingDel } =
    useMutation({
      mutationFn: (id) => deleteMatchApi(id),
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Unmatched sucessfully!',
          text2: 'This user is no longer among your matches.',
          topOffset: 55,
        })
        queryClient.invalidateQueries({
          queryKey: ['matches'],
        })
      },
      onError: (error) =>
        Toast.show({
          type: 'error',
          text1: 'User was not unmatched',
          text2: error.message,
        }),
    })

  return { deleteMatch, isLoadingDel }
}
