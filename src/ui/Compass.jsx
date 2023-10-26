import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import styled from 'styled-components/native'
import theme from '../theme'
import { Magnetometer } from 'expo-sensors'

import { useDarkMode } from '../contexts/DarkModeContext'

const CompassContainer = styled(View)`
  position: absolute;
  top: 70px;
  left: 20px;
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
  border-top-color: ${(props) => props.variant.textWhite};
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
  border-bottom-color: ${theme.colors.accent};
  /* transform: translateX(100%); */
`

const CompassText = styled(Text)`
  color: ${(props) => props.variant.textWhite};
  background: ${(props) => props.variant.background};
  margin: 5px;
  padding: 5px 10px;
  font-weight: bold;
  width: 50px;
  text-align: center;
  border-radius: ${theme.radiuses.full};
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

            const angle = Math.atan2(smoothedX, smoothedY) * (180 / Math.PI)

            // Adjust the angle for magnetic declination
            const adjustedAngle = angle -10 + magneticDeclination
            setHeading(adjustedAngle >= 0 ? adjustedAngle : 360 + adjustedAngle)
          })

          Magnetometer.setUpdateInterval(250)
        }
      }

      subscribeToMagnetometer()

      return () => {
        Magnetometer.removeAllListeners()
      }
    }, [])

  return (
    <CompassContainer>
      <CompassBox variant={variant}>
        <CompassNeedle rotation={heading}>
          <NeedleSouth variant={variant} />
          <NeedleNorth />
        </CompassNeedle>
      </CompassBox>
      <CompassText variant={variant}>{Math.trunc(heading)}°</CompassText>
    </CompassContainer>
  )
}
