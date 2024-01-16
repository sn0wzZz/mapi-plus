import {
  Text,
  TouchableOpacity,
} from 'react-native'

import styled, {css} from 'styled-components/native'
import theme from '../theme'

const variants = {
  primary: css`
    background-color: ${theme.colors.accent};
  `,
  secondary: css`
    border-width: 2px;
    border-color: ${theme.colors.accent};
  `,
}

const StyledButton = styled(TouchableOpacity)`
  justify-content: center;
  align-items: center;
  border-radius: ${theme.radiuses.full};
  padding: 10px 15px;
  height: 55px;
  z-index: 1;
  ${(props) => variants[props.variant]}
`
const StyledText = styled(Text)`
  color:${props=> props.variant === 'primary' ? 'black' : `${theme.colors.accent}`};
  text-align: center;
  font-weight: bold;
  font-size:18px;
  ${props=> props.textStyle}
`

export default function ButtonText({
  children,
  onPressFunction,
  onLongPressFunction,
  variant,
  textStyle,
  title
}) {
  return (
    <StyledButton
      variant={variant}
      onPress={onPressFunction}
      onLongPress={onLongPressFunction}
      title={title}
    >
      <StyledText variant={variant} textStyle={textStyle}>{children}</StyledText>
    </StyledButton>
  )
}

ButtonText.defaultProps={
  variant: 'secondary'
}
