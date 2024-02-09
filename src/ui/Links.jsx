import { TextInput, View } from 'react-native'
import styled from 'styled-components/native'
import Link from './Link'
import ButtonIcon from './ButtonIcon'
import { useDarkMode } from '../contexts/DarkModeContext'
import { useEffect, useRef, useState } from 'react'
import uuid from 'react-native-uuid'
import theme from '../theme'
import { useUpdateUser } from '../features/authentication/useUpdateUser'
import useUser from '../features/authentication/useUser'
import { BottomSheetTextInput } from '@gorhom/bottom-sheet'

const LinksBox = styled(View)`
  display: flex;
  gap: 10px;
`
const LinksList = styled(View)`
  gap: 5px;
`
const InputBox = styled(View)`
  display: flex;
  flex-direction: row;
  width: 86%;
  gap: 15px;
`
const Input = styled(BottomSheetTextInput)`
  background-color: ${(props) => props.variant.underlay};
  color: ${(props) => props.variant.accent};
  border-radius: ${theme.radiuses.full};
  width: 100%;
  padding: 5px 10px;
`

const socialMedias = [
  'facebook',
  'twitter',
  'snapchat',
  'instagram',
  'reddit',
  'tumblur',
  'github',
  'youtube',
  'vk',
]

function isLink(str) {
  // Regular expression for a simple URL pattern
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/

  // Test the string against the pattern
  return urlPattern.test(str)
}

export default function Links() {
  const { user } = useUser()
  const { links: userLinks } = user?.user_metadata
  const { variant } = useDarkMode()
  const [links, setLinks] = useState(userLinks)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const { updateUser, isUpdating } = useUpdateUser()

  const updateLinks = () => {
    if (!input || !isLink(input) || links.length >= 5) return
    const newLink = { id: uuid.v4(), url: input }
    setLinks((links) => [...links, newLink])
    setInput('')
  }
  useEffect(() => {
    updateUser({ links })
    // console.log(links)
  }, [links])

  return (
    <LinksBox>
      <LinksList>
        {links?.map((link) => {
          // const icon = socialMedias.includes(link.title.toLocaleLowerCase()) ? `logo-${link.title.toLocaleLowerCase()}` : 'earth-outline'
          const matchingLink = socialMedias.find((media) =>
            link.url.toLowerCase().includes(media)
          )
          const icon = matchingLink ? `logo-${matchingLink}` : 'earth-outline'
          return (
            <Link
              key={link.id}
              links={links}
              link={link}
              iconName={icon}
              setLinks={setLinks}
            />
          )
        })}
      </LinksList>
      {links.length < 5 && (
        <InputBox>
          <Input
            ref={inputRef}
            variant={variant}
            placeholder='Add a link...'
            placeholderTextColor={variant.textSecondary}
            value={input}
            onChangeText={setInput}
          ></Input>
          <ButtonIcon
            onPressFunction={updateLinks}
            iconName='add-outline'
            color={variant.accent}
            bgColor={variant.underlay}
            size={30}
            bgSize={40}
            style={'position: relative;'}
            isLoading={isUpdating}
          />
        </InputBox>
      )}
    </LinksBox>
  )
}
