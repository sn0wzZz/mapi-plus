import supabase from './supabase'



// CREATE operation for Messages
export async function createMessage(newMessage) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([newMessage])
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    console.error('Error creating message:', error.message)
  }
}

// READ operation for Messages
export async function getMessagesByChatId(chatId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('match_id', chatId)
      .order('timestamp', { ascending: true })
    if (error) {
      throw error
    }
    return data
  } catch (error) {
    console.error('Error fetching messages:', error.message)
  }
}
