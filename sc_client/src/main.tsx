import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import MenuProvider from './contexts/menu.tsx'
import { UserProvider } from './contexts/user.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MenuProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </MenuProvider>
  </StrictMode>
)