import { useQuery } from '@tanstack/react-query'
import { getMessagesByChatId } from '../../services/apiChats'


export default function useGetMessagesById(id) {
  const {
    error,
    data: fetchedMessages,
    isFetching,
  } = useQuery({
    queryKey: ['messages'],
    queryFn: () => getMessagesByChatId(id),
  })

  return { fetchedMessages, isFetching, error }
}
