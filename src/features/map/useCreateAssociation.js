import { useMutation } from '@tanstack/react-query'
import { createAssociation as createAssociationApi } from '../../services/apiAssociations'
import { useEffect } from 'react'

export default function useCreateAssociation() {
  const { mutate: createAssociation, isPending } = useMutation({
    mutationKey: ['associations'],
    mutationFn: createAssociationApi,
    onSuccess: () => console.log('success'),
    onError: (error) => console.log(error.message),
  })


  return { createAssociation, isPending }
}
