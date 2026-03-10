import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useEffect, useState } from 'react';
import { useWsData } from '../hooks/useWsData';

export default function TelemetryChart({
    sensorName,
    type = 'monotone',
    color = '#8884d8',
    maxPoints = 20,
    url = 'ws://localhost:1880/ws/telemetry'
}) {
    const [chartHistory, setChartHistory] = useState([]);
    const wsData = useWsData(url);

    useEffect(() => {
        if (wsData?.sensor === sensorName) {
            const formatted = new Intl.DateTimeFormat('en-GB', {
                timeStyle: 'medium',
            }).format(new Date(wsData.timestamp || Date.now()));

            setChartHistory(prev => {
                const newData = [
                    ...prev,
                    { time: formatted, value: wsData.value }
                ];
                return newData.slice(-maxPoints);
            });
        }
    }, [wsData, sensorName, maxPoints]);

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={chartHistory} >
                    <CartesianGrid stroke="#aaa" strokeDasharray="3 3" />
                    <XAxis dataKey="time" stroke="#666" fontSize={12} />
                    <YAxis stroke="#666" fontSize={12} />
                    <Line
                        type={type}
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                    <RechartsDevtools />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
