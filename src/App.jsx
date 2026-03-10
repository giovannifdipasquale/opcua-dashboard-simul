import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useWsData } from './hooks/useWsData'

function App() {
  const [count, setCount] = useState(0)
  const wsData = useWsData('ws://localhost:1880/ws/telemetry');
  console.log(wsData);
  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">6</div>
        <div className="col-span-6">6</div>
        <div className="col-span-6">6</div>
        <div className="col-span-6">6</div>
      </div>
    </>
  )
}

export default App
