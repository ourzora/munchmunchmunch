import { BASE_LAYER } from './../../constants/layers'
import { AudioControls, AudioControlsVariants } from './AudioControls'
import { AudioTimeLabels } from './AudioTimeLabels'
import { Box, Flex, SpinnerOG } from '@zoralabs/zord'
import { isClientSide } from 'constants/window'
import hash from 'object-hash'
import React, { CSSProperties, useCallback, useEffect, useState } from 'react'
import { audioGrid } from './mediaStyles.css'

const WaveSurfer = isClientSide ? require('wavesurfer.js') : null

export interface AudioRendererProps {
  style?: CSSProperties
  className?: string
  src: string
  coverImageUrl?: string
  playable?: boolean
  controlType?: AudioControlsVariants
  inverted?: boolean
  compact?: boolean
}

const AUDIO_SKIP_SECONDS = 5

function AudioRenderer({
  style,
  className,
  coverImageUrl,
  src,
  playable = false,
  controlType = AudioControlsVariants.PLAYPAUSE,
  inverted = false,
  compact = false,
}: AudioRendererProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [waveForm, setWaveForm] = useState<undefined | typeof WaveSurfer>()
  const [currentTime, setCurrentTime] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const audioId = React.useMemo(() => hash(src), [src])
  useEffect(() => {
    let isMounted = true
    if (!isClientSide) {
      return
    }

    if (WaveSurfer && !waveForm && src && isMounted) {
      const w = WaveSurfer.create({
        barWidth: 1.8,
        barGap: 3,
        barMinHeight: 8,
        barHeight: 5,
        cursorWidth: 1,
        container: `#waveform-${audioId}`,
        height: 100,
        progressColor: '#666',
        responsive: true,
        waveColor: '#ccc',
        cursorColor: 'transparent',
        loopSelection: true,
        interact: false,
      })

      w.load(src)

      w.on('ready', async function () {
        try {
          if (isMounted) {
            setWaveForm(w)
            setTotalTime(w.getDuration())
          }
        } catch (e) {
          if (isMounted) {
            console.error(e)
          }
        }
      })

      w.on('play', function () {
        setIsPlaying(true)
      })

      w.on('pause', function () {
        setIsPlaying(false)
      })

      w.on('finish', function () {
        w.play()
      })
      w.on('audioprocess', function () {
        setCurrentTime(w.getCurrentTime())
      })
    }

    return () => {
      if (waveForm) {
        waveForm.unAll()
        waveForm.destroy()
      }
      isMounted = false
    }
  }, [src, waveForm, audioId])

  const onPlayPause = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    waveForm?.playPause()
  }

  const onReverse = () => {
    waveForm?.skipBackward(AUDIO_SKIP_SECONDS)
  }

  const onForward = () => {
    waveForm?.skipForward(AUDIO_SKIP_SECONDS)
  }

  const handleWaveClick = useCallback(async () => {
    if (waveForm && playable) {
      await waveForm.playPause()
    }
  }, [playable, waveForm])

  if (compact) {
    return (
      <Flex align="center" justify="center" h="100%" w="100%">
        <Flex align="center" justify="center" w="100%" h="100%">
          <Box
            backgroundColor="background1"
            w="100%"
            style={{
              boxShadow: 'rgb(0 0 0 / 5%) 0px 5px 10px',
              borderRadius: '20px',
            }}
          >
            <Box
              position="relative"
              w="100%"
              h="100%"
              className={className}
              style={style}
            >
              <Flex
                className="wave-container"
                onClick={handleWaveClick}
                direction="column"
                align="center"
                justify="center"
                gap="x4"
                w="100%"
                h="100%"
                position="relative"
                cursor="pointer"
              >
                {coverImageUrl && (
                  <Box position="absolute" top="x0" left="x0" w="100%" h="100%">
                    <img
                      alt="Cover image"
                      src={coverImageUrl}
                      style={{
                        display: 'block',
                        maxWidth: '100%',
                        position: 'absolute',
                        objectFit: 'contain',
                        objectPosition: '50% 50%',
                        top: 0,
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  </Box>
                )}
                <Box
                  w="100%"
                  style={{
                    zIndex: BASE_LAYER,
                    display: coverImageUrl ? 'none' : 'block',
                  }}
                  id={`waveform-${audioId}`}
                />
                {!waveForm ? (
                  <Flex
                    position="absolute"
                    top="x0"
                    right="x0"
                    bottom="x0"
                    left="x0"
                    w="100%"
                    h="100%"
                    align="center"
                    justify="center"
                  >
                    <SpinnerOG />
                  </Flex>
                ) : (
                  <>
                    {controlType === AudioControlsVariants.FULL && (
                      <AudioTimeLabels currentTime={currentTime} totalTime={totalTime} />
                    )}
                    <AudioControls
                      isPlaying={isPlaying}
                      controlType={controlType}
                      onPlayPause={onPlayPause}
                      onReverse={onReverse}
                      onForward={onForward}
                      inverted={inverted}
                      compact={compact}
                      coverImageUrl={coverImageUrl}
                    />
                  </>
                )}
              </Flex>
            </Box>
          </Box>
        </Flex>
      </Flex>
    )
  } else {
    return (
      <Flex className={audioGrid} align="center" justify="center" h="100%" w="100%">
        {coverImageUrl && (
          <Box
            style={{
              maxWidth: 380,
              maxHeight: 380,
              margin: 'auto',
              width: '100%',
              height: '80%',
            }}
          >
            <img
              alt="Cover image"
              src={coverImageUrl}
              style={{
                display: 'block',
                height: '100%',
                objectFit: 'contain',
                objectPosition: '50% 50%',
                width: '100%',
              }}
            />
          </Box>
        )}
        <Flex align="center" justify="center" w="100%" h="100%">
          <Box
            backgroundColor="background1"
            w="100%"
            p="x8"
            style={{
              boxShadow: 'rgb(0 0 0 / 5%) 0px 5px 10px',
              borderRadius: '20px',
            }}
          >
            <Box
              position="relative"
              w="100%"
              h="100%"
              className={className}
              style={style}
            >
              {!!src ? (
                <Flex
                  className="wave-container"
                  data-audio-src={src}
                  onClick={handleWaveClick}
                  direction="column"
                  align="center"
                  justify="center"
                  gap="x4"
                  w="100%"
                  h="100%"
                  position="relative"
                  cursor="pointer"
                >
                  <Box
                    w="100%"
                    style={{
                      zIndex: BASE_LAYER,
                    }}
                    id={`waveform-${audioId}`}
                  />
                  {!waveForm ? (
                    <Flex
                      position="absolute"
                      top="x0"
                      right="x0"
                      bottom="x0"
                      left="x0"
                      w="100%"
                      h="100%"
                      align="center"
                      justify="center"
                    >
                      <SpinnerOG />
                    </Flex>
                  ) : (
                    <>
                      {controlType === AudioControlsVariants.FULL && (
                        <AudioTimeLabels
                          currentTime={currentTime}
                          totalTime={totalTime}
                        />
                      )}
                      <AudioControls
                        isPlaying={isPlaying}
                        controlType={controlType}
                        onPlayPause={onPlayPause}
                        onReverse={onReverse}
                        onForward={onForward}
                        inverted={inverted}
                        compact={compact}
                        coverImageUrl={coverImageUrl}
                      />
                    </>
                  )}
                </Flex>
              ) : (
                <Flex
                  position="absolute"
                  top="x0"
                  right="x0"
                  bottom="x0"
                  left="x0"
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                >
                  <SpinnerOG />
                </Flex>
              )}
            </Box>
          </Box>
        </Flex>
      </Flex>
    )
  }
}

export { AudioRenderer }
