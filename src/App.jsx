import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TelemetryChart from './components/TelemetryChart'
import { useWsData } from './hooks/useWsData';

function App() {
  const [isStreaming, setIsStreaming] = useState(true);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString('en-GB', { timeStyle: 'medium' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-GB', { timeStyle: 'medium' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: wsData, status: wsStatus } = useWsData('ws://localhost:1880/ws/telemetry', isStreaming);

  return (
    <>
      <div className="flex justify-between items-center mb-6 p-4 bg-dark">
        <div className="text-xl font-bold text-light"> Telemetry Dashboard </div>
        <div className="flex gap-3 items-center">
          <span className="font-mono bg-dark text-accent px-3 py-1 rounded shadow-sm">{time}</span>
          <span className={`px-3 py-1 rounded font-medium text-sm shadow-sm ${wsStatus === 'Connected' ? 'bg-emerald-500 text-white' :
            wsStatus === 'Connecting...' ? 'bg-yellow-500 text-dark' :
              'bg-rose-500 text-white'
            }`}>
            {wsStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-6">
          <TelemetryChart clearTrigger={clearTrigger} wsData={wsData} sensorName="Sinusoid" type="monotone" color="#253031" fill="#d2e313" chartType="line" />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TelemetryChart clearTrigger={clearTrigger} wsData={wsData} sensorName="Square" type="step" color="#d2e313" fill="#253031" chartType="line" />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TelemetryChart clearTrigger={clearTrigger} wsData={wsData} sensorName="Random" type="area" color="#253031" fill="#d2e313" chartType="area" />
        </div>
        <div className="col-span-12 md:col-span-6">
          <TelemetryChart clearTrigger={clearTrigger} wsData={wsData} sensorName="Counter" type="area" color="#253031" fill="#d2e313" chartType="bar" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-2">
        <button
          onClick={() => setIsStreaming(true)}
          disabled={isStreaming}
          className={`col-span-12 md:col-span-4 px-6 py-2 text-white font-medium rounded-md transition-colors shadow-sm ${isStreaming ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent text-dark hover:bg-emerald-600'
            }`}
        >
          Start
        </button>
        <button
          onClick={() => setIsStreaming(false)}
          disabled={!isStreaming}
          className={`col-span-12 md:col-span-4 px-6 py-2 font-medium rounded-md transition-colors shadow-sm ${!isStreaming ? 'bg-gray-400 text-light cursor-not-allowed' : 'bg-rose-500 hover:bg-rose-600'
            }`}
        >
          Stop
        </button>
        <button
          onClick={() => setClearTrigger(prev => prev + 1)}
          className={`col-span-12 md:col-span-4 px-6 py-2 font-medium rounded-md transition-colors shadow-sm bg-dark text-accent`}
        >
          Clear Data
        </button>
      </div>
    </>
  )
}

export default App
