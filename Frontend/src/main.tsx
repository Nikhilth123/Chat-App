import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from 'next-themes'
import store from './redux/store.ts'
import { Provider } from 'react-redux'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <ThemeProvider attribute="class"
      defaultTheme="system"
      enableSystem
      >
    <App />
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
