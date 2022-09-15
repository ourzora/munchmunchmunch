import { OldIcon, OldIconType } from './../OldIcon'
import React from 'react'
import { Box, Button, Flex } from '@zoralabs/zord'
import { audioButtons } from './mediaStyles.css'

export enum AudioControlsVariants {
  FULL, // play/pause, rewind, fast-forward
  PLAYPAUSE, // play/pause only
  NONE, // no controls
}

interface AudioControlsProps {
  onPlayPause: (e: React.MouseEvent<HTMLButtonElement>) => void
  onForward: () => void
  onReverse: () => void
  isPlaying: boolean
  controlType?: AudioControlsVariants
  inverted: boolean
  compact: boolean
  coverImageUrl?: string
}

function AudioControls({
  onPlayPause,
  onForward,
  onReverse,
  isPlaying,
  controlType = AudioControlsVariants.FULL,
  inverted,
  compact,
  coverImageUrl,
}: AudioControlsProps) {
  if (controlType === AudioControlsVariants.NONE) return null
  const padding = compact && coverImageUrl ? '16px' : '32px'
  const size = compact && coverImageUrl ? 18 : 36
  const styles =
    compact && coverImageUrl
      ? ({ position: 'absolute', bottom: '16px', right: '16px' } as const)
      : ({ position: 'static', bottom: '0', right: '0' } as const)
  return (
    <Flex justify="center" style={styles}>
      {controlType === AudioControlsVariants.FULL && (
        <Button
          style={{ padding }}
          className={audioButtons}
          variant="ghost"
          onClick={onReverse}
        >
          <OldIcon
            size={size}
            icon={OldIconType.BACK_ARROW}
            style={{ filter: inverted ? 'unset' : 'invert(1)' }}
          />
        </Button>
      )}
      <Box>
        <Button
          style={{ padding }}
          className={audioButtons}
          variant={inverted ? 'secondary' : 'primary'}
          onClick={onPlayPause}
        >
          <OldIcon
            size={size}
            icon={isPlaying ? OldIconType.PAUSE : OldIconType.TRIANGLE_RIGHT}
            style={{ filter: inverted ? 'unset' : 'invert(1)' }}
          />
        </Button>
      </Box>
      {controlType === AudioControlsVariants.FULL && (
        <Button
          variant="ghost"
          style={{ padding }}
          className={audioButtons}
          onClick={onForward}
        >
          <OldIcon
            size={size}
            icon={OldIconType.BACK_ARROW}
            reverse
            style={{ filter: inverted ? 'unset' : 'invert(1)' }}
          />
        </Button>
      )}
    </Flex>
  )
}

export { AudioControls }
