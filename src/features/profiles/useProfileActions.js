// useProfileActions.js
import { AlertTemplate } from '../../utils/helpers'
import useGetAllMatches from '../matches/useGetAllMatches'
import useUserMatches from '../matches/useUserMatches'
import useCreateMatch from '../matches/useCreateMatch'
import useUpdateMatch from '../matches/useUpdateMatch'
import useDeleteMatch from '../matches/useDeleteMatch'
import useUser from '../authentication/useUser'
import { useUserContext } from '../../contexts/UserContext'

const useProfileActions = (profileId) => {
  const { user } = useUser()
  const { allMatches } = useGetAllMatches()
  const { userMatches } = useUserMatches(user?.id, 'matched')
  const { userMatches: userPendings } = useUserMatches(user?.id, 'pending')
  const { createMatch, isLoading } = useCreateMatch()
  const { updateMatch } = useUpdateMatch()
  const { deleteMatch } = useDeleteMatch()
  const {allMatchesList } = useUserContext()

  // console.log(allMatchesList)
  const currentMatch = allMatchesList?.find(
    (match) =>
      (match.profile_id === profileId && match.user_id === user.id) ||
      (match.profile_id === user.id && match.user_id === profileId)
  )

  const newMatch = {
    user_id: user?.id,
    profile_id: profileId,
    status: 'pending',
  }

  const updatedMatch = {
    user_id: currentMatch?.user_id,
    profile_id: currentMatch?.profile_id,
    status: 'matched',
    timestamp: currentMatch?.timestamp,
  }

  const matchProfile = () => {
    if (currentMatch) {
      updateMatch({ id: currentMatch.id, updatedMatch })
    } else {
      createMatch(newMatch)
    }
  }

  const isMatched = userMatches?.some((match) => match === profileId)
  const isPending = userPendings?.some((match) => match.confirmer === profileId)
  // console.log('current', currentMatch?.id)

  const unmatchProfile = () => {
    AlertTemplate(
      !isPending
        ? 'Do you want to unmatch this user?'
        : 'Do you want to cancel the match request?',
      !isPending
        ? 'Clicking OK will remove this person from your matches.'
        : 'Clicking OK will cancel the request.',
      () => deleteMatch(currentMatch?.id)
    )
  }

  return {
    isPending,
    isMatched,
    isLoading,
    currentMatch,
    matchProfile,
    unmatchProfile,
  }
}

export default useProfileActions
