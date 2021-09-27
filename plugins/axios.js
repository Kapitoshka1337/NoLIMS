export default function ({ $axios, redirect }) {
    $axios.onRequest(config => {
      console.log('Making request to ' + config.url)
    })
  
    $axios.onError(error => {
      const code = parseInt(error.response && error.response.status)
      if (code === 400) {
          {
              console.log("Error")
              console.log(error.response.data['Message'])
          }
        // redirect('/400')
      }
    })
  }