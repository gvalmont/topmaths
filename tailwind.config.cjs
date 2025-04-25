const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')
const flipclass = plugin(function ({ addUtilities }) {
  addUtilities({
    '.flip-rotate-y-180': {
      transform: 'rotateY(180deg)'
    },
    '.preserve-3d': {
      transformStyle: 'preserve-3d'
    },
    '.perspective': {
      perspective: '1000px'
    },
    '.backface-hidden': {
      backfaceVisibility: 'hidden'
    }
  })
})
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{html,js,svelte,ts}',
    './node_modules/tw-elements/dist/js/**/*.js'],
  safelist: [
    {
      pattern: /grid-cols-./,
      variants: ['lg', 'md']
    }
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '32px',
        '5xl': '40px',
        '6xl': '48px'
      },
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
        14: 'repeat(14, minmax(0, 1fr))',
        15: 'repeat(15, minmax(0, 1fr))',
        16: 'repeat(16, minmax(0, 1fr))',
        17: 'repeat(17, minmax(0, 1fr))',
        18: 'repeat(18, minmax(0, 1fr))',
        19: 'repeat(19, minmax(0, 1fr))',
        20: 'repeat(20, minmax(0, 1fr))',
        21: 'repeat(21, minmax(0, 1fr))',
        22: 'repeat(22, minmax(0, 1fr))',
        23: 'repeat(23, minmax(0, 1fr))',
        24: 'repeat(24, minmax(0, 1fr))',
        25: 'repeat(25, minmax(0, 1fr))',
        26: 'repeat(26, minmax(0, 1fr))',
        27: 'repeat(27, minmax(0, 1fr))',
        28: 'repeat(28, minmax(0, 1fr))',
        29: 'repeat(29, minmax(0, 1fr))',
        30: 'repeat(30, minmax(0, 1fr))'
      },
      scale: {
        175: '1.75',
        200: '2.00'
      },
      colors: {
        // Keep in sync with src/topmaths/styles/tailwind-colors.scss, themes.css and types/color.ts
        topmaths: {
          DEFAULT: '#0284c7',
          light: '#0284c7',
          filter: 'invert(51%) sepia(74%) saturate(6105%) hue-rotate(179deg) brightness(92%) contrast(98%)',
          canvas: {
            DEFAULT: '#ffffff', // Keep in sync with index.html html, body background-color
            dark: '#f6f6f6'
          },
          corpus: {
            DEFAULT: '#1d1d1d',
            light: '#45505b'
          }
        },
        topmathsdark: {
          DEFAULT: '#0284c7',
          light: '#0284c7',
          filter: 'invert(51%) sepia(74%) saturate(6105%) hue-rotate(179deg) brightness(92%) contrast(98%)',
          canvas: {
            DEFAULT: '#ffffff', // Keep in sync with index.html html, body background-color
            dark: '#f6f6f6'
          },
          corpus: {
            DEFAULT: '#1d1d1d',
            light: '#45505b'
          }
        },
        is: {
          DEFAULT: 'transparent',
          sponsor: {
            DEFAULT: '#ea4aaa',
            light: '#fffafa',
            filter: 'invert(41%) sepia(47%) saturate(2515%) hue-rotate(298deg) brightness(97%) contrast(88%)'
          },
          fuchsia: {
            DEFAULT: '#c75ad5',
            light: '#c75ad5',
            filter: 'invert(66%) sepia(95%) saturate(7499%) hue-rotate(280deg) brightness(89%) contrast(100%)'
          },
          green: {
            DEFAULT: '#16A34A',
            light: '#16A34A',
            filter: 'invert(43%) sepia(81%) saturate(478%) hue-rotate(89deg) brightness(98%) contrast(91%)'
          },
          link: {
            DEFAULT: '#485fc7',
            light: '#eff1fa',
            filter: 'invert(29%) sepia(98%) saturate(796%) hue-rotate(203deg) brightness(101%) contrast(88%)'
          },
          info: {
            DEFAULT: '#3e8ed0',
            light: 'e7f4fc',
            filter: 'invert(49%) sepia(45%) saturate(746%) hue-rotate(165deg) brightness(94%) contrast(83%)',
            darker: {
              DEFAULT: '#4175d2',
              light: '#e93fa5',
              filter: 'invert(42%) sepia(53%) saturate(1203%) hue-rotate(190deg) brightness(88%) contrast(84%)'
            }
          },
          warning: {
            DEFAULT: '#ffe08a',
            light: '#fff3d1',
            filter: 'invert(73%) sepia(96%) saturate(209%) hue-rotate(346deg) brightness(104%) contrast(103%)'
          },
          danger: {
            DEFAULT: '#f14668',
            light: '#fcd4dc',
            filter: 'invert(44%) sepia(73%) saturate(4057%) hue-rotate(324deg) brightness(98%) contrast(92%)'
          },
          purple: {
            DEFAULT: '#9333ea',
            light: '#faf5ff',
            filter: 'invert(22%) sepia(70%) saturate(3716%) hue-rotate(264deg) brightness(94%) contrast(95%)'
          },
          tout: {
            DEFAULT: '#feb60a',
            light: '#fffbeb',
            filter: 'invert(82%) sepia(18%) saturate(7498%) hue-rotate(354deg) brightness(103%) contrast(99%)'
          },
          brown: {
            DEFAULT: '#A0522D',
            light: '#EFD8CD',
            filter: 'invert(33%) sepia(58%) saturate(769%) hue-rotate(336deg) brightness(94%) contrast(82%)'
          },
          coopmaths: {
            DEFAULT: '#F15929',
            light: '#F15929',
            filter: 'invert(54%) sepia(65%) saturate(5242%) hue-rotate(346deg) brightness(98%) contrast(92%)'
          },
          black: {
            DEFAULT: '#000000',
            light: '#FFFFFF',
            filter: 'invert(11%) sepia(12%) saturate(783%) hue-rotate(169deg) brightness(93%) contrast(92%)'
          }
        },
        // end of sync
        coopmaths: {
          DEFAULT: '#F15929',
          lightest: '#f87f5c',
          light: '#f56d45',
          dark: '#F45E27',
          darkest: '#E64A10',
          back: '#f5f1f3',
          backdark: '#dadbdf',
          backdarker: '#cecfd4',
          backcorrection: '#E0A588',
          backnav: '#F15929',
          backnavlight: '#f56d45',
          title: '#342A34',
          titlemenu: '#F15929',
          titlelight: '#f5f1f3',
          titleexercise: '#F15929',
          darkmode: '#2e2e2b',
          darkmodelight: '#363633',
          canvas: {
            DEFAULT: '#ffffff', // Anciennement '#EDEDF0'
            dark: '#f6f6f6',
            darkest: '#e9e9e9',
            moredark: '#c8c8c8'
          },
          corpus: {
            DEFAULT: '#1F2429',
            light: '#45505b',
            lightest: '#6a7c8d',
            dark: '#191d21',
            darkest: '#131619'
          },
          action: {
            DEFAULT: '#F15929',
            light: '#f47a54',
            lightest: '#f79b7f',
            dark: '#d43d0e',
            darkest: '#9f2e0a',
            100: '#feeeea',
            200: '#fcded4',
            300: '#fbcdbf',
            400: '#f9bda9',
            500: '#f8ac94',
            600: '#f79b7f',
            700: '#f58b69',
            800: '#f47a54',
            900: '#f26a3e'
          },
          warn: {
            DEFAULT: '#80D925',
            light: '#99e150',
            lightest: '#b3e97c',
            dark: '#66ae1e',
            darkest: '#4d8216',
            50: '#f3fced',
            100: '#e6f9db',
            200: '#daf5c9',
            300: '#cdf2b7',
            400: '#c1eea4',
            500: '#b4ea90',
            600: '#a8e67c',
            700: '#9be265',
            800: '#8edd4b',
            900: '#6ebc1f',
            1000: '#5da119',
            1100: '#4d8613'
          },
          struct: {
            DEFAULT: '#216D9A',
            light: '#2c93cf',
            lightest: '#5faedd',
            dark: '#1a577b',
            darkest: '#14415c'
          }
        },
        coopmathsdark: {
          DEFAULT: '#F15929',
          lightest: '#f87f5c',
          light: '#f56d45',
          dark: '#F45E27',
          darkest: '#E64A10',
          back: '#f5f1f3',
          backdark: '#dadbdf',
          backdarker: '#cecfd4',
          backcorrection: '#E0A588',
          backnav: '#F15929',
          backnavlight: '#f56d45',
          title: '#342A34',
          titlemenu: '#F15929',
          titlelight: '#f5f1f3',
          titleexercise: '#F15929',
          darkmode: '#2e2e2b',
          darkmodelight: '#363633',
          canvas: {
            DEFAULT: '#ffffff', // Anciennement '#EDEDF0'
            dark: '#f6f6f6',
            darkest: '#e9e9e9',
            moredark: '#c8c8c8',
            light: '#ffffff'
          },
          corpus: {
            DEFAULT: '#1F2429',
            light: '#45505b',
            lightest: '#6a7c8d',
            dark: '#191d21',
            darkest: '#131619'
          },
          action: {
            DEFAULT: '#F15929',
            light: '#f47a54',
            lightest: '#f79b7f',
            dark: '#d43d0e',
            darkest: '#9f2e0a',
            100: '#feeeea',
            200: '#fcded4',
            300: '#fbcdbf',
            400: '#f9bda9',
            500: '#f8ac94',
            600: '#f79b7f',
            700: '#f58b69',
            800: '#f47a54',
            900: '#f26a3e'
          },
          warn: {
            DEFAULT: '#80D925',
            light: '#99e150',
            lightest: '#b3e97c',
            dark: '#66ae1e',
            darkest: '#4d8216',
            50: '#f3fced',
            100: '#e6f9db',
            200: '#daf5c9',
            300: '#cdf2b7',
            400: '#c1eea4',
            500: '#b4ea90',
            600: '#a8e67c',
            700: '#9be265',
            800: '#8edd4b',
            900: '#6ebc1f',
            1000: '#5da119',
            1100: '#4d8613'
          },
          struct: {
            DEFAULT: '#216D9A',
            light: '#2c93cf',
            lightest: '#5faedd',
            dark: '#1a577b',
            darkest: '#14415c'
          }
        },
      },
      fontFamily: {
        sans: ['"Arial"', ...defaultTheme.fontFamily.sans],
        logo9: 'jelleebold',
        mono: [...defaultTheme.fontFamily.mono]
      },
      transitionProperty: {
        width: 'width'
      }
    }
  },
  variants: {
    display: ['group-hover']
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#F15929',
          secondary: '#216D9A',
          accent: '#D84010',
          neutral: '#e1e1e6',
          'base-100': '#FFFF',
          info: '#bd93f9',
          success: '#36D399',
          warning: '#FBBD23',
          error: '#F87272'
        }
      }
    ]
  },
  plugins: [
    require('tw-elements/dist/plugin.cjs'),
    require('daisyui'),
    // Pour les tooltips
    require('@tailwindcss/forms'),
    // Pour ???
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }),
    flipclass
  ],
  rules: {
    // require() Require statement not part of import statement.
    '@typescript-eslint/no-var-requires': 0
  }
}

module.exports = config
