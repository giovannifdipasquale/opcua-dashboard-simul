import { useState, useEffect } from 'react';


export function useWsData(url, isEnabled = true) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (!isEnabled) return;

        const ws = new WebSocket(url);

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

    return data;
}