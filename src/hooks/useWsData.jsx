import { useState, useEffect } from 'react';


export function useWsData(url, isEnabled = true) {
    const [data, setData] = useState(null);
    const [status, setStatus] = useState('Disconnected');

    useEffect(() => {
        if (!isEnabled) {
            setStatus('Disconnected');
            return;
        }

        setStatus('Connecting...');
        const ws = new WebSocket(url);

        ws.onopen = () => setStatus('Connected');
        ws.onclose = () => setStatus('Disconnected');
        ws.onerror = () => setStatus('Error');

        ws.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data);
                setData(parsedData);
            } catch (err) {
                console.error("Data parsing error:", err);
            }
        };

        return () => ws.close();
    }, [url, isEnabled]);

    return { data, status };
}