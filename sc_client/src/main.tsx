import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import MenuProvider from './contexts/menu.tsx'
import { UserProvider } from './contexts/user.tsx'
import { PageProvider } from './contexts/active-page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageProvider>
      <MenuProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </MenuProvider>
    </PageProvider>
  </StrictMode>
)