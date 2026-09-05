import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './store'
import queryClient from './queryClient'
import AppContextProvider from './context/AppContext.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '35933636516-kpmgubbo1i3h0bhlroaov1qv3l6ehudv.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId}>
          <BrowserRouter>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </BrowserRouter>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
