import { OldIcon, OldIconType } from './../OldIcon'
import React from 'react'
import { Flex, Label } from '@zoralabs/zord'

export interface FileRendererProps {
  className?: string
  contentType: string
  source: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler
  size?: number
  compact?: boolean
  showLabel?: boolean
}

function FileRenderer({
  className,
  contentType,
  source,
  compact = false,
  style,
  size = 48,
  showLabel = true,
}: FileRendererProps) {
  return (
    <Flex
      className={className}
      style={{
        height: '100%',
        width: '100%',
        background: 'white',
        maxWidth: 600,
        maxHeight: 600,
        ...style,
      }}
      direction="column"
      justify="center"
    >
      <OldIcon icon={OldIconType.FILE} size={size} />
      {showLabel && (
        <Label mt="x4" mb="x2">
          {contentType}
        </Label>
      )}
      {!compact && (
        <a target="_blank" rel="noreferrer noopener" href={source}>
          Download file
        </a>
      )}
    </Flex>
  )
}

export { FileRenderer }
