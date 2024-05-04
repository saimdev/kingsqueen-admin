import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ChakraProvider } from '@chakra-ui/react'
import { ConfigProvider } from 'antd'
import { Toaster } from 'react-hot-toast'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ChakraProvider>
        
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4FD1C5',
            }
          }}
        >
          <RouterProvider router={router} />
          </ConfigProvider>
      </ChakraProvider>
    </>
  )
}

export default App
