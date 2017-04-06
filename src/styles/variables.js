let fonts = {
  noto: '"Noto Sans", '
}

let fontSizes = {
  'font-size-page-title': '2.6rem',
  'font-size-default': '1.8rem'
}

let baseColors = {
  'primary': '#2196F3',
  'accent': '#8BC34A',
  'color-main-background': '#f3f3f4',
  'text-default': '#000000',
  'primary-contrast': '#ffffff',
  'accent-contrast': '#ffffff'
}

// When does a size break?
let breakpoints = {
  'layout-breakpoint-xxs': 480,
  'layout-breakpoint-xs': 600,
  'layout-breakpoint-sm-tablet': 720,
  'layout-breakpoint-sm': 840,
  'layout-breakpoint-md': 960,
  'layout-breakpoint-lg-tablet': 1024,
  'layout-breakpoint-lg': 1280,
  'layout-breakpoint-xl': 1440,
  'layout-breakpoint-xxl': 1600,
  'layout-breakpoint-xxxl': 1920
}

// Media helpers
let mediaHelpers = {
  'media-xxs-max-width': `${breakpoints['layout-breakpoint-xxs']}px`,
  'media-xs-max-width': `${breakpoints['layout-breakpoint-xs']}px`,
  'media-sm-max-width': `${breakpoints['layout-breakpoint-sm']}px`,
  'media-md-max-width': `${breakpoints['layout-breakpoint-md']}px`,
  'media-lg-max-width': `${breakpoints['layout-breakpoint-lg']}px`,
  'media-xl-max-width': `${breakpoints['layout-breakpoint-xl']}px`,
  'media-xxl-max-width': `${breakpoints['layout-breakpoint-xxl']}px`,
  'media-xxxl-max-width': `${breakpoints['layout-breakpoint-xxxl']}px`,

  'media-xs-min-width': `${breakpoints['layout-breakpoint-xxs'] + 1}px`,
  'media-sm-min-width': `${breakpoints['layout-breakpoint-xs'] + 1}px`,
  'media-md-min-width': `${breakpoints['layout-breakpoint-sm'] + 1}px`,
  'media-lg-min-width': `${breakpoints['layout-breakpoint-md'] + 1}px`,
  'media-xl-min-width': `${breakpoints['layout-breakpoint-lg'] + 1}px`,
  'media-xxl-min-width': `${breakpoints['layout-breakpoint-xl'] + 1}px`,
  'media-xxxl-min-width': `${breakpoints['layout-breakpoint-xxl'] + 1}px`
}

// Z-indices
let zIndices = {
  'z-index-toolbar': 1
}

let misc = {
  'transition-function-default': 'cubic-bezier(.4, 0, .2, 1)'
}

module.exports = Object.assign(
  {},
  fonts,
  fontSizes,
  baseColors,
  mediaHelpers,
  breakpoints,
  zIndices,
  misc
)
