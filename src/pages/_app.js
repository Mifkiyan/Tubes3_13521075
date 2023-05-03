import { QueryClient, QueryClientProvider, Hydrate } from "react-query"
import { store } from "../../redux/store.js"
import { Provider } from "react-redux"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state = {pageProps.dehydratedState}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </Hydrate>
    </QueryClientProvider>
  ) 
}

export default MyApp