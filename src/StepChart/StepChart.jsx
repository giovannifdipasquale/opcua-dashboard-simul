import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useEffect, useState } from 'react';
import { useWsData } from '../hooks/useWsData';



// #endregion
export default function StepChart() {
    const [chartHistory, setChartHistory] = useState([]);
    const wsData = useWsData('ws://localhost:1880/ws/telemetry');
    useEffect(() => {
        if (wsData?.sensor === 'Square') {
            console.log(wsData);
            setChartHistory(prev => {
                const newData = [
                    ...prev,
                    { time: new Date().toLocaleTimeString(), value: wsData.value }
                ];
                // Keep only the last 20 points
                return newData.slice(-20);
            });
        }
    }, [wsData]);
    return (
        <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }} responsive data={chartHistory}>
            <CartesianGrid stroke="#aaa" strokeDasharray="3" />
            <XAxis dataKey="time" stroke="#000000" />
            <YAxis width="auto" stroke="#000000" />
            <Line dataKey="value"
                type="step"
                stroke="#d2e313ff"
                strokeWidth={2}
            />
            <RechartsDevtools />
        </LineChart>
    );
}