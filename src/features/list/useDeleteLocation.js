import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletLocation } from '../../services/apiLocations'
import Toast from 'react-native-toast-message'

export default function useDeleteLocation() {
  const queryClient = useQueryClient()
  const { mutate: deleteOnlineLocations, isPending: isLoadingDel } =
    useMutation({
      mutationFn: (ids) => ids.forEach((id) => deletLocation(id)),
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'Location deleted sucessfully!',
          text2: 'This location is no longer availabel.',
          topOffset: 55,
        })
        queryClient.invalidateQueries({
          queryKey: ['locations'],
        })
      },
      onError: (error) =>
        Toast.show({
          type: 'error',
          text1: 'Location was not deleted!',
          text2: error.message,
        }),
    })

  return { deleteOnlineLocations, isLoadingDel }
}
