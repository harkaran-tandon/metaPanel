import { StrictMode } from 'react'
import './registerServiceWorker.ts'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from './Root/ErrorBoundary.tsx';
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>
)
