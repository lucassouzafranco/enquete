import { useState } from 'react'
import './App.css'
import Menu from './components/Menu/Menu'
import Content from './components/Content/Content'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='appContainer'>
        <Menu />
        <Content />
      </div>
      
    </>
  )
}

export default App
