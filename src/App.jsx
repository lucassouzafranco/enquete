import { useState } from 'react'
import './App.css'
import Menu from './components/Menu/Menu'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='appContainer'>
        <Menu />
      </div>
      
    </>
  )
}

export default App
