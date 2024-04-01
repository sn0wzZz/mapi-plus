import React, { useState, useCallback, useEffect } from 'react'
import {
  Bubble,
  Day,
  GiftedChat,
  Time,
  InputToolbar,
  Send,
  Composer,
} from 'react-native-gifted-chat'
import { useDarkMode } from '../../contexts/DarkModeContext'
import useUser from '../authentication/useUser'
import theme from '../../theme'
import { View } from 'react-native'
import ButtonIcon from '../../ui/ButtonIcon'
import { useNavigation } from '@react-navigation/native'
import useCreateMessage from './useCreateMessage'
import useGetMessagesById from './useGetMessagesById'
import supabase from '../../services/supabase'
import Spinner from '../../ui/Spinner'
import { Avatar, Name } from '../profiles/Profile'
import { useUserContext } from '../../contexts/UserContext'
import { useMapContext } from '../../contexts/MapContext'

// Styling constants
const bubbleStyles = (variant) => ({
  textStyle: {
    left: { color: variant.text },
  },
  wrapperStyle: {
    left: {
      padding: 5,
      borderRadius: 25,
      backgroundColor: '#c2c2c22c',
      width: 'auto',
    },
    right: {
      padding: 5,
      borderRadius: 25,
      backgroundColor: variant.accent,
      width: 'auto',
    },
  },
})

const inputToolbarStyles = (variant) => ({
  accessoryStyle: { color: 'green' },
  renderComposer: (props) => (
    <Composer
      {...props}
      placeholderTextColor={variant.textSecondary}
      textInputStyle={{
        color: variant.accent,
        alignSelf: 'center',
        height: '100%',
        paddingVertical: 5,
        paddingHorizontal: 5,
      }}
    />
  ),
  primaryStyle: {
    backgroundColor: variant.overlay,
    width: '96%',
    borderRadius: Number(theme.radiuses.md.replace('px', '')),
    marginHorizontal: 8,
    marginTop: 7,
  },
  containerStyle: {
    // elevation: 25,
    position: 'relative',
    color: variant.accent,
    borderTopWidth: 0,
    backgroundColor: variant.backgroundTrSolid,
    borderTopLeftRadius: Number(theme.radiuses.md.replace('px', '')),
    borderTopRightRadius: Number(theme.radiuses.md.replace('px', '')),
    height: '100%',
    display: 'flex',
  },
})

const sendStyles = (variant) => ({
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    color: variant.text,
    backgroundColor: variant.accent,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Number(theme.radiuses.md.replace('px', '')),
  },
  sendButtonProps: {
    style: {
      alignItems: 'center',
      color: 'black',
      right: -4,
      top: '1.7%',
    },
  },
})

export function Chat({
  route: {
    params: { matchId, profile },
  },
}) {
  const { variant } = useDarkMode()
  const { user } = useUser()
  const { goBack, getState } = useNavigation()
  const { createMessage } = useCreateMessage()
  const { setCalloutIsPressed } = useMapContext()
  const { setUserMatchesVisible, currentRoute } = useUserContext()
  const { fetchedMessages, isFetching } = useGetMessagesById(matchId)

  const backToMatches = () => {
    console.log(currentRoute)
    if (currentRoute === 'Map') setCalloutIsPressed(true)
    if (currentRoute === 'List') setUserMatchesVisible(true)
    goBack()
  }

  const format = (item) => {
    return {
      _id: item.id,
      text: item.content+' ',
      createdAt: new Date(item.timestamp),
      user: {
        _id: item.sender_id,
        name: profile?.name,
        avatar: profile?.avatar,
      },
    }
  }

  useEffect(() => {
    const subscription = supabase
      .channel(`messages_change`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newData = payload.new
          const newMessage = format(payload.new)
          console.log('payload', newData)
          setMessages((old) => [...old, newMessage])
        }
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [fetchedMessages])

  useEffect(() => {
    if (fetchedMessages) {
      const formattedMessages = fetchedMessages.map((msg) => format(msg))
      setMessages(formattedMessages)
    }
  }, [fetchedMessages])

  const [messages, setMessages] = useState(fetchedMessages || [])

  const onSend = useCallback(
    (newMessages) => {
      createMessage({
        match_id: matchId,
        sender_id: user?.id,
        content: newMessages[0].text,
      })
    },
    [createMessage, matchId, user]
  )

  const revMessages = messages.sort((a, b) => b.createdAt - a.createdAt)
  return (
    <View style={{ flex: 1, backgroundColor: variant.backgroundSolid }}>
      <View
        style={{
          height: 130,
          // elevation:25,
          width: '100%',
          top: 0,
          backgroundColor: variant.backgroundTrSolid,
          borderBottomRightRadius: Number(theme.radiuses.md.replace('px', '')),
          borderBottomLeftRadius: Number(theme.radiuses.md.replace('px', '')),
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            width:'97%',
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 5,
            borderRadius: Number(
              theme.radiuses.md.replace('px', '')
            ),
            backgroundColor: variant.underlay,
            padding: 10,
            paddingRight: 'auto'
          }}
        >
          <ButtonIcon
            iconName={'chevron-back'}
            color={variant.accent}
            left
            onPressFunction={backToMatches}
            style={'position:absolute; left:10px;'}
          />
          <Avatar
            variant={variant}
            source={
              profile?.avatar
                ? profile?.avatar
                : require(`../../../assets/default-user.jpg`)
            }
            style={{ width: 60, height: 60 }}
            alt={`Avatar of ${profile?.name}}`}
          />
          <Name variant={variant}>{profile?.name}</Name>
        </View>
      </View>
      {isFetching ? (
        <View style={{ transform: 'translateY(-20px)' }}>
          <Spinner size={'20px'} />
        </View>
      ) : (
        <GiftedChat
          onSend={onSend}
          user={{
            _id: user?.id,
          }}
          messagesContainerStyle={{
            backgroundColor: variant.backgroundSolid,
          }}
          renderBubble={(props) => (
            <Bubble {...props} {...bubbleStyles(variant)} />
          )}
          renderInputToolbar={(props) => (
            <InputToolbar {...props} {...inputToolbarStyles(variant)} />
          )}
          renderSend={(props) => (
            <Send
              {...props}
              {...sendStyles(variant)}
              alwaysShowSend
              label='Send'
            />
          )}
          minInputToolbarHeight={60}
          renderDay={(props) => <Day {...props} />}
          renderTime={(props) => <Time {...props} />}
          messages={revMessages}
        />
      )}
    </View>
  )
}
