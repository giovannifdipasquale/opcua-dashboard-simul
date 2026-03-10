import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TelemetryChart from './components/TelemetryChart'
import { useWsData } from './hooks/useWsData';

function App() {
  const [isStreaming, setIsStreaming] = useState(true);

  const wsData = useWsData('ws://localhost:1880/ws/telemetry', isStreaming);
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

      <div className="grid grid-cols-12 gap-4 mt-6">
        <button
          onClick={() => setIsStreaming(true)}
          disabled={isStreaming}
          className={`col-span-6 px-6 py-2 text-white font-medium rounded-md transition-colors shadow-sm ${isStreaming ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
        >
          Start
        </button>
        <button
          onClick={() => setIsStreaming(false)}
          disabled={!isStreaming}
          className={`col-span-6 px-6 py-2 text-white font-medium rounded-md transition-colors shadow-sm ${!isStreaming ? 'bg-gray-400 cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'
            }`}
        >
          Stop
        </button>
      </div>
    </>
  )
}

export default App
