import { BottomSheetFlatList } from '@gorhom/bottom-sheet'
import ProfileItem from './ProfileItem'
import styled from 'styled-components'

import useGetProfileByIds from './useGetProfileByIds'
import Spinner from '../../ui/Spinner'

const ListBox = styled(BottomSheetFlatList)`
  padding: 0px 10px;
`

export default function ProfileList({ list, listIds, isLoading }) {
  const { data: profiles, isPending } = useGetProfileByIds(listIds)

  return !isPending && !isLoading ? (
    <ListBox
      data={list || profiles}
      renderItem={({ item }) => <ProfileItem item={item} />}
    />
  ) : (
    <Spinner size={'large'} />
  )
}
