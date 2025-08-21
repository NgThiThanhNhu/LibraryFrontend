import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../css/tailwind.css'
import App from './App.tsx'
//import front roboto
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { AuthProvider } from './pages/Authentication/AuthProvider.tsx';
import { SignalRProvider } from './context/SignalRContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SignalRProvider>
        <App />
      </SignalRProvider>
    </AuthProvider>
  </StrictMode>,
)
