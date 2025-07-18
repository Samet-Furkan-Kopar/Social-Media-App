import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from './context/AuthContext.tsx'

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  
    <QueryClientProvider client={client}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
    ,
  
);
