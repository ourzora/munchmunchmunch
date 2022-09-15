import React from 'react'
import { Box, ease } from "@zoralabs/zord";
import { ipfsImage } from '@lib/helpers'

export function Backdrop({src}: {src?: string}) {
  const [loaded, setLoaded] = React.useState(false)
  
  const imgLoaded = React.useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <Box
      style={{ zIndex: 0 }}
      position="fixed"
      inset="x0"
      overflow="hidden"
    >
      <Box
        as="img"
        src={ipfsImage(src)}
        objectFit="cover"
        inset="x0"
        position="absolute"
        style={{
          filter: 'blur(25px)',
          transform: 'scale(1.25)',
          opacity: `${loaded ? 1 : 0}`,
          transition: `opacity 400ms ${ease.in}`
        }}
        onLoad={imgLoaded}
      />
    </Box>
  )
}