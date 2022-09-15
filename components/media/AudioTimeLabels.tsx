import React from 'react'
import { Flex } from '@zoralabs/zord'

interface AudioTimeLabelsProps {
  currentTime: number
  totalTime: number
}

export const formatTime = (seconds: number) => {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')}`
}

export const AudioTimeLabels: React.NamedExoticComponent<AudioTimeLabelsProps> =
  React.memo(({ currentTime, totalTime }) => {
    return (
      <Flex p="x2" justify="space-between">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(totalTime)}</span>
      </Flex>
    )
  })

AudioTimeLabels.displayName = 'AudioTimeLabels'
