export default function ({ $axios, app, store }) {
  $axios.onRequest((config) => {
    if (store.state.user) {
      config.headers.common.Authorization = store.state.user.token.tokenSession
    }
  })
}
