// Source: https://github.com/kittykatattack/scaleToWindow

enum Center {
  HORIZONTALLY,
  VERTICALLY
}

const scaleToWindow = (canvas: HTMLCanvasElement): number => {
  let center: Center

  // 1. Scale the canvas to the correct size
  // Figure out the scale amount on each axis
  const scaleX = window.innerWidth / canvas.offsetWidth
  const scaleY = window.innerHeight / canvas.offsetHeight

  // Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
  const scale = Math.min(scaleX, scaleY)
  canvas.style.transformOrigin = '0 0'
  canvas.style.transform = 'scale(' + scale + ')'

  // 2. Center the canvas.
  // Decide whether to center the canvas vertically or horizontally.
  // Wide canvases should be centered vertically, and
  // square or tall canvases should be centered horizontally
  if (canvas.offsetWidth > canvas.offsetHeight) {
    if (canvas.offsetWidth * scale < window.innerWidth) {
      center = Center.HORIZONTALLY
    } else {
      center = Center.VERTICALLY
    }
  } else {
    if (canvas.offsetHeight * scale < window.innerHeight) {
      center = Center.VERTICALLY
    } else {
      center = Center.HORIZONTALLY
    }
  }

  // Center horizontally (for square or tall canvases)
  let margin
  if (center === Center.HORIZONTALLY) {
    margin = (window.innerWidth - canvas.offsetWidth * scale) / 2
    canvas.style.marginTop = 0 + 'px'
    canvas.style.marginBottom = 0 + 'px'
    canvas.style.marginLeft = margin + 'px'
    canvas.style.marginRight = margin + 'px'
  }

  // Center vertically (for wide canvases)
  if (center === Center.VERTICALLY) {
    margin = (window.innerHeight - canvas.offsetHeight * scale) / 2
    canvas.style.marginTop = margin + 'px'
    canvas.style.marginBottom = margin + 'px'
    canvas.style.marginLeft = 0 + 'px'
    canvas.style.marginRight = 0 + 'px'
  }

  // 3. Remove any padding from the canvas  and body and set the canvas
  // display style to "block"
  canvas.style.paddingLeft = 0 + 'px'
  canvas.style.paddingRight = 0 + 'px'
  canvas.style.paddingTop = 0 + 'px'
  canvas.style.paddingBottom = 0 + 'px'
  canvas.style.display = 'block'

  return scale
}

export default scaleToWindow
