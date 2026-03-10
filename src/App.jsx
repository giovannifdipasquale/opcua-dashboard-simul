import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TelemetryChart from './components/TelemetryChart'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <TelemetryChart sensorName="Sinusoid" type="monotone" color="#000000" />
        </div>
        <div className="col-span-6">
          <TelemetryChart sensorName="Square" type="step" color="#d2e313" />
        </div>
      </div>
    </>
  )
}

export default App
