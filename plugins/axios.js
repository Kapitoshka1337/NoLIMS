export default function ({ $axios, redirect, store }) {
    $axios.onRequest(config => {})
  
    $axios.onError(error => {
        //const code = parseInt(error.response && error.response.status)
      if (error.response)
        store.$toast.error(error.response.data['Message']);
      else
        store.$toast.error(error);
          // redirect('/400')
      })
}
