import supabase from './supabase'

export async function createAssociation(newAssociation) {
  const { data, error } = await supabase
    .from('associations')
    .upsert([newAssociation])

  if (error) {
    throw new Error('User has already been to this location!')
  }

  return data
}

export async function getProfileIdsFromLocation(locationId) {
  const { data } = await supabase
    .from('associations')
    .select('profile_id')
    .eq('location_id', locationId)

  const ids = data.map((profileObj) => profileObj.profile_id)

  return ids
}
