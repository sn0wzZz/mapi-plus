import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLocation } from '../../services/apiLocations'
import Toast from 'react-native-toast-message'


export default function useCreateLocation() {
  const queryClient = useQueryClient()

  const { mutate: createOnlineLocation, isLoading: isLoadingOnline } =
    useMutation({
      mutationFn: createLocation,
      onSuccess: () => {
        Toast.show({
          type: 'success',
          text1: 'New location created sucessfully!',
          text2: 'This location is now available.',
        })
        queryClient.invalidateQueries({
          queryKey: ['locations'],
        })
      },
      onError: (error) =>
        Toast.show({
          type: 'error',
          text1: 'Location was not created!',
          text2: error.message,
        }),
    })
  return {createOnlineLocation, isLoadingOnline}
}