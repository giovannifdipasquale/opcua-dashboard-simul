import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useEffect, useState } from 'react';
import { useWsData } from '../hooks/useWsData';
// #region Sample data
const data = [
    {
        name: 'A',
        uv: 400,
        pv: 240,
        amt: 2400,
    },
    {
        name: 'B',
        uv: 300,
        pv: 456,
        amt: 2400,
    },
    {
        name: 'C',
        uv: 300,
        pv: 139,
        amt: 2400,
    },
    {
        name: 'D',
        uv: 200,
        pv: 980,
        amt: 2400,
    },
    {
        name: 'E',
        uv: 278,
        pv: 390,
        amt: 2400,
    },
    {
        name: 'F',
        uv: 189,
        pv: 480,
        amt: 2400,
    },
];

// #endregion

export default function IndexLineChart() {
    const [chartHistory, setChartHistory] = useState([]);

    const wsData = useWsData('ws://localhost:1880/ws/telemetry');
    useEffect(() => {
        if (wsData?.sensor === 'Sinusoid') {
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
        <LineChart style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} responsive data={chartHistory} >
            <CartesianGrid stroke="#000000" strokeDasharray="5 5" />
            <XAxis dataKey="time" stroke="#000000" />
            <YAxis width="auto" stroke="#000000" />
            <Line
                type="monotone"
                dataKey="value"
                stroke="#000000"
                dot={{
                    fill: '#000000',
                }}
                activeDot={{
                    stroke: '#000000',
                }}
            />
            <Line
                type="monotone"
                dataKey="pv"
                stroke="#000000"
                dot={{
                    fill: '#000000',
                }}
                activeDot={{
                    stroke: '#000000',
                }}
            />
            <RechartsDevtools />
        </LineChart>
    );
}