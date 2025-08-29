import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import {Usercontextprovider} from './contexts/usercontext.jsx'
import { Capitancontextprovider } from './contexts/capitancontent.jsx'
import { SocketProvider } from './contexts/socketcontext.jsx'

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
      <SocketProvider>
     < Capitancontextprovider>
      <Usercontextprovider>
        <App />
        </Usercontextprovider>
        </Capitancontextprovider>
        </SocketProvider>
  </BrowserRouter>

)
