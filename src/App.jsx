import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TelemetryChart from './components/TelemetryChart'
import { useWsData } from './hooks/useWsData';

function App() {

  const wsData = useWsData('ws://localhost:1880/ws/telemetry');
  console.log(wsData);

  return (
    <>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <TelemetryChart wsData={wsData} sensorName="Sinusoid" type="monotone" color="#000000" chartType="line" />
        </div>
        <div className="col-span-6">
          <TelemetryChart wsData={wsData} sensorName="Square" type="step" color="#d2e313" chartType="line" />
        </div>
        <div className="col-span-6">
          <TelemetryChart wsData={wsData} sensorName="Random" type="area" color="#e39a13ff" chartType="area" />
        </div>
        <div className="col-span-6">
          <TelemetryChart wsData={wsData} sensorName="Counter" type="area" color="#e39a13ff" chartType="bar" />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <button>Start</button>
        </div>
        <div className="col-span-6">
          <button>Stop</button>
        </div>
      </div>
    </>
  )
}

export default App
