import { style } from '@vanilla-extract/css'

const maxWidthValues = {
  minWidth: 0,
  maxWidth: 1200,
}

export const audioButtons = style({
  height: 'auto',
  boxShadow: '0px 0px 14px 2px rgba(255, 255, 255, 0.8)',
  minWidth: 0,
  borderRadius: '100%',
})

export const audioGrid = style({
  display: 'grid',
  gridTemplateColumns: '400px 1fr',
  gap: '32px',
  maxWidth: maxWidthValues.maxWidth + 200,
  margin: 'auto',
  '@media': {
    'screen and (max-width: 768px)': {
      gridTemplateColumns: '1fr',
      gap: '16px',
    },
  },
})
