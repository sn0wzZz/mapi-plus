import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../theme'
import { Magnetometer } from 'expo-sensors'

import { useDarkMode } from '../contexts/DarkModeContext'


const CompassContainer = styled(View)`
  position: absolute;
  top: 110px;
  left: 10px;
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
  z-index: 999;
`
const CompassBox = styled(View)`
  background: ${(props) => props.variant.background};
  max-width: 50px;
  height: 50px;
  flex: 1;
  flex-direction: row;
  border-radius: ${theme.radiuses.full};
  align-items: center;
  justify-content: center;
`

const CompassNeedle = styled(View)`
  width: 5px;
  height: 50px;
  transform: rotate(${(props) => props.rotation}deg);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`
const NeedleSouth = styled(View)`
  position: absolute;
  transform: translateY(12.5px);
  border-left-width: 5px;
  border-top-width: 20px;
  border-right-width: 5px;
  border-bottom-width: 5px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-top-color: ${theme.colors.accent};
`
const NeedleNorth = styled(View)`
  position: absolute;
  transform: translateY(-12.5px);
  border-left-width: 5px;
  border-bottom-width: 20px;
  border-right-width: 5px;
  border-top-width: 5px;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-bottom-color: ${(props) => props.variant.textSecondary};
  /* transform: translateX(100%); */
`

const CompassText = styled(Text)`
  color: ${(props) => props.variant.textSecondary};
  background: ${(props) => props.variant.background};
  margin: 5px;
  padding: 5px 10px;
  font-weight: bold;
  width: max-content;
  max-width: 76px;
  text-align: center;
  border-radius: ${theme.radiuses.full};
`
const Span = styled(Text)`
  color: ${theme.colors.accent};
`
const magneticDeclination = -10

export default function Compass() {
  const { variant } = useDarkMode()
  const [heading, setHeading] = useState(0)
    const [smoothedMagnetometerData, setSmoothedMagnetometerData] = useState({
      x: 0,
      y: 0,
    })
    const alpha = 0.9 // Smoothing factor (adjust as needed)



    useEffect(() => {
      const subscribeToMagnetometer = async () => {
        const magnetometerAvailable = await Magnetometer.isAvailableAsync()

        if (magnetometerAvailable) {
          Magnetometer.addListener((data) => {
            const { x, y } = data

            // Apply the low-pass filter to magnetometer data
            const smoothedX =
              alpha * x + (1 - alpha) * smoothedMagnetometerData.x
            const smoothedY =
              alpha * y + (1 - alpha) * smoothedMagnetometerData.y

            // Update the smoothed data
            setSmoothedMagnetometerData({ x: smoothedX, y: smoothedY })
            
              let angle = 0
                if (Math.atan2(y, x) >= 0) {
                  angle = Math.atan2(y, x) * (180 / Math.PI)
                } else {
                  angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI)
                }


            // const angle = Math.atan2(smoothedX, smoothedY) * (180 / Math.PI)
            // const angle =
            //   (Math.atan2(smoothedX, smoothedY) + 2 * Math.PI) * (180 / Math.PI)

            // Adjust the angle for magnetic declination
            const adjustedAngle = angle + magneticDeclination
            setHeading(
              adjustedAngle - 90 >= 0
                ? adjustedAngle - 80
                : 281 + adjustedAngle
            )
          })

          Magnetometer.setUpdateInterval(1000)
        }
      }

      subscribeToMagnetometer()

      return () => {
        Magnetometer.removeAllListeners()
      }
    }, [])

    const direction = (degree) => {
      if (degree >= 22.5 && degree < 67.5) {
        return 'NE'
      } else if (degree >= 67.5 && degree < 112.5) {
        return 'E'
      } else if (degree >= 112.5 && degree < 157.5) {
        return 'SE'
      } else if (degree >= 157.5 && degree < 202.5) {
        return 'S'
      } else if (degree >= 202.5 && degree < 247.5) {
        return 'SW'
      } else if (degree >= 247.5 && degree < 292.5) {
        return 'W'
      } else if (degree >= 292.5 && degree < 337.5) {
        return 'NW'
      } else {
        return 'N'
      }
    }

  return (
    <CompassContainer>
      <CompassBox variant={variant}>
        <CompassNeedle rotation={-heading}>
          <NeedleSouth />
          <NeedleNorth variant={variant} />
        </CompassNeedle>
      </CompassBox>
      <CompassText variant={variant}>
        {Math.trunc(heading)}° <Span>{direction(Math.trunc(heading))}</Span>
      </CompassText>
    </CompassContainer>
  )
}
