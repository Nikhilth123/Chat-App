import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from 'next-themes'
import store from './redux/store.ts'
import { Provider } from 'react-redux'
import { SocketProvider } from './services/SocketProvider.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <ThemeProvider attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <App />
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  </StrictMode>,
)
