export default function ({ $axios, redirect, store }) {
    $axios.onRequest(config => {
      // debugger
      // let url = config.url;
      // let splitUrl = url.split('/');
      // let str = splitUrl[2].split("?")[0]
      // let action = config.method === "get" ? "view" : config.method === "post" ? "add" : ""
      // let kk = str + "." + action
      // // [ { } ] permission: [equimpent.view] <- KEY
      // if (store.$auth.state.user)
      // {
      //   let path = store.$auth.state.user.claims.filter(claim => {
      //     let keys = Object.keys(claim.permissions).filter(key => key === kk)
      //   })
      // }
    })

    $axios.onResponse(response => { })
    $axios.onRequestError(err => { })
    $axios.onResponseError(err => { })

    $axios.onError(error => {
        //const code = parseInt(error.response && error.response.status)
      if (error.response)
        store.$toast.error(error.response.data['Message']);
      else
        store.$toast.error(error);
          // redirect('/400')
      })
}
