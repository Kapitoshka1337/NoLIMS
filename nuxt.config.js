import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: "static",
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Client',
    title: 'Client',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/checkPermission.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/proxy',
    '@nuxtjs/toast'
  ],

  router: {
    middleware: ['auth']
  },  

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: "https://localhost:9001/",
    common: {
      "Content-type" : "applications/json"
    }
    // proxy: true
  },

  proxy: {
    // '/api/': { target: 'https://localhost:9001/', pathRewrite: {'^/api/': ''} }
    // '/api': {
    //   target: 'https://localhost:9001/api',
    //   pathRewrite: {'^/api' : ''},
    //   secure: false,
    //   changeOrigin: true
    // },
  },

  toast: {
    position: 'top-right',
    duration: '2000'
  },

  auth: {
    strategies: {
     local: {
       token: {
         property: 'data.jwToken',
         global: true,
         // required: true,
         type: 'Bearer'
       },
       user: {
         property: 'data',
         autoFetch: true
       },
       endpoints: {
         login: { url: 'api/account/login', method: 'post', propertyName: "data.jwToken"},
         logout: false,
         user: { url: 'api/user/info', method: 'get'}
       }
     }
    },
    redirect: {
      login: '/login/view',
      logout: '/login/view',
      callback: '/login/view',
      home: '/'
    }
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: colors.blue,
          accent: colors.grey,
          secondary: colors.amber,
          info: colors.teal,
          warning: colors.amber,
          error: colors.deepOrange,
          success: colors.green
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
