import { CartesianGrid, Line, LineChart, AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';
import { useEffect, useState } from 'react';

export default function TelemetryChart({
    wsData,
    sensorName,
    type = 'monotone',
    color = '#ebe66a',
    fill = '#ebe66a',
    maxPoints = 20,
    chartType = 'line'
}) {
    const [chartHistory, setChartHistory] = useState([]);

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

    const mapChartType = {
        line: {
            component: LineChart,
            data: Line
        },
        area: {
            component: AreaChart,
            data: Area
        },
        bar: {
            component: BarChart,
            data: Bar
        }
    };
    // Dynamic Chart Type
    const ChartComponent = mapChartType[chartType].component;
    const DataComponent = mapChartType[chartType].data;
    return (
        <>
            <h1 className="text-3xl font-bold text-center p-2">{sensorName}</h1>
            <div style={{ width: '100%', aspectRatio: 1.618, maxWidth: 800, margin: 'auto' }} >
                <ResponsiveContainer>
                    <ChartComponent data={chartHistory} >
                        <CartesianGrid stroke="#aaa" strokeDasharray="3 3" />
                        <XAxis dataKey="time" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />

                        <DataComponent
                            type={type}
                            dataKey="value"
                            stroke={color}
                            fill={fill}
                            strokeWidth={2}
                            isAnimationActive={false}
                        />

                        <RechartsDevtools />
                    </ChartComponent>
                </ResponsiveContainer>
            </div >
        </>
    );
}
