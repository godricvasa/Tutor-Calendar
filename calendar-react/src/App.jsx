import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Full from './components/Full'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Full />
    </>
  )
}

export default App
