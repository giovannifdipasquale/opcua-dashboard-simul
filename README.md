# React Node-RED Telemetry Dashboard

A frontend dashboard built with React (Vite) and Tailwind CSS to visualize real-time high-frequency telemetry data using WebSockets and Recharts.

This project connects to a local Node-RED flow functioning as a dashboard to visualize OPCUA data,  subscribing to multiple simulated data streams (Sinusoid, Square wave, Random noise, and Counter).

## Features & Implementation

### 0. Node-RED Flow (OPC-UA to WebSocket)
- **OPC-UA Subscription:** Utilizes `node-red-contrib-opcua` palette to connect to the Prosys OPC-UA Simulation Server (`opc.tcp://uademo.prosysopc.com:53530`).
- **Topic Ingestion:** Automatically subscribes on startup to distinct OPC-UA Node IDs representing the different signal types (e.g., `ns=3;i=1004` -> Sinusoid, `ns=3;i=1005` -> Square).
- **Data Normalization:** A function node intercepts the OPC-UA payloads, formats them to human-readable payloads: JSON format (`{ sensor, value, timestamp }`).
- **Broadcasting:** Routes the normalized objects to a `websocket out` node, serving as an unauthenticated local broadcast at `/ws/telemetry`.

### 1. WebSocket Hook (`useWsData.jsx`)
- Implemented a custom React hook to manage the WebSocket lifecycle natively within React's render cycle.
- The hook actively tracks connection states (`Connected`, `Connecting...`, `Disconnected`).
- It also mounts and unmounts the socket connection inside the `useEffect` cleanup function (`return () => ws.close();`).

### 2. Chart Component Abstraction (`TelemetryChart.jsx`)
- Abstracted chart layout + logic into a single, reusable `<TelemetryChart />` component.
- The component accepts props (`sensorName`, `type`, `color`, `fill`, `chartType`) to dynamically render the appropriate Recharts component (`LineChart`, `AreaChart`, `BarChart`).

### 3. Data Buffering
- Implemented a sliding-window data buffer directly in the component state using `slice(-maxPoints)`.
- The chart only retains the most recent 20 data points, blocking memory consumption as points increase over time.

### 4. Client-Side Stream Control
- Added start/stop controls that toggle a boolean state passed into the `useWsData` hook. This closes the active WebSocket connection when stopped.
- Implemented a "Clear Data" feature utilizing a `clearTrigger` prop sequence, allowing the user to reset the `chartHistory` arrays while keeping the WebSocket stream alive.

### 5. Styling
- Built using a custom 3-color palette integrated into basic CSS variables (`--bg-color`, `--text-color`, `--accent-color`).
- Utilized Tailwind CSS grid breakpoints (`col-span-12 md:col-span-6`) to ensure the dashboard is mobile-responsive.

## Demo



https://github.com/user-attachments/assets/eff307bd-ae47-4067-9988-32f500712bac



## Setup Instructions

This frontend requires a running Node-RED instance broadcasting JSON payloads over a local WebSocket route at `ws://localhost:1880/ws/telemetry`.

<details>
<summary>Click to expand Node-RED Flow JSON</summary>

```json
[
    {
        "id": "7748fb34bf7ce280",
        "type": "OpcUa-Client",
        "z": "7a1d7333005beb91",
        "endpoint": "fe716c8b4aeefe9f",
        "action": "subscribe",
        "deadbandtype": "a",
        "deadbandvalue": 1,
        "time": "5",
        "timeUnit": "s",
        "certificate": "n",
        "localfile": "",
        "localkeyfile": "",
        "securitymode": "None",
        "securitypolicy": "None",
        "useTransport": false,
        "maxChunkCount": 1,
        "maxMessageSize": 8192,
        "receiveBufferSize": 8192,
        "sendBufferSize": 8192,
        "setstatusandtime": false,
        "keepsessionalive": false,
        "name": "OPC UA Subscribe",
        "applicationName": "",
        "applicationUri": "",
        "x": 770,
        "y": 620,
        "wires": [
            [
                "e86260bd95dcaedb",
                "73c5976bb7d79b42"
            ],
            [],
            []
        ]
    },
    {
        "id": "2cba668215c8add1",
        "type": "inject",
        "z": "7a1d7333005beb91",
        "name": "Sub Sinusoid",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "1",
        "topic": "ns=3;i=1004",
        "x": 500,
        "y": 580,
        "wires": [
            [
                "7748fb34bf7ce280"
            ]
        ]
    },
    {
        "id": "55c8c0824fde22ea",
        "type": "inject",
        "z": "7a1d7333005beb91",
        "name": "Sub Square",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "1",
        "topic": "ns=3;i=1005",
        "x": 490,
        "y": 640,
        "wires": [
            [
                "7748fb34bf7ce280"
            ]
        ]
    },
    {
        "id": "e86260bd95dcaedb",
        "type": "function",
        "z": "7a1d7333005beb91",
        "name": "Format JSON for React",
        "func": "const sensorMap = {\n    \"ns=3;i=1001\": \"Counter\",\n    \"ns=3;i=1002\": \"Random\",\n    \"ns=3;i=1003\": \"Sawtooth\",\n    \"ns=3;i=1004\": \"Sinusoid\",\n    \"ns=3;i=1005\": \"Square\",\n    \"ns=3;i=1006\": \"Triangle\"\n};\n\nconst sensorName = sensorMap[msg.topic] || \"Unknown\";\n\n// Estrae il valore numerico pulito\nlet val = typeof msg.payload === 'object' ? msg.payload.value : msg.payload;\n\n// Crea il pacchetto per React\nmsg.payload = {\n    sensor: sensorName,\n    value: Number(val),\n    timestamp: new Date().toISOString()\n};\n\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 1050,
        "y": 620,
        "wires": [
            [
                "5d8662e9c607be48",
                "83a6527abef30971"
            ]
        ]
    },
    {
        "id": "5d8662e9c607be48",
        "type": "websocket out",
        "z": "7a1d7333005beb91",
        "name": "React WebSocket",
        "server": "67714618c3e66fee",
        "client": "",
        "x": 1430,
        "y": 580,
        "wires": []
    },
    {
        "id": "83a6527abef30971",
        "type": "debug",
        "z": "7a1d7333005beb91",
        "name": "Debug JSON",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 1410,
        "y": 660,
        "wires": []
    },
    {
        "id": "73c5976bb7d79b42",
        "type": "debug",
        "z": "7a1d7333005beb91",
        "name": "debug 10",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 1040,
        "y": 460,
        "wires": []
    },
    {
        "id": "64ffaae450ecf584",
        "type": "inject",
        "z": "7a1d7333005beb91",
        "name": "Sub Random",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "1",
        "topic": "ns=3;i=1002",
        "x": 500,
        "y": 520,
        "wires": [
            [
                "7748fb34bf7ce280"
            ]
        ]
    },
    {
        "id": "1b3b9c0d5f82ecdf",
        "type": "inject",
        "z": "7a1d7333005beb91",
        "name": "Sub Counter",
        "props": [
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": "1",
        "topic": "ns=3;i=1001",
        "x": 490,
        "y": 480,
        "wires": [
            [
                "7748fb34bf7ce280"
            ]
        ]
    },
    {
        "id": "fe716c8b4aeefe9f",
        "type": "OpcUa-Endpoint",
        "name": "Public Endpoint",
        "endpoint": "opc.tcp://uademo.prosysopc.com:53530/OPCUA/SimulationServer",
        "secpol": "None",
        "secmode": "None",
        "none": true,
        "login": false,
        "usercert": false,
        "usercertificate": "",
        "userprivatekey": ""
    },
    {
        "id": "67714618c3e66fee",
        "type": "websocket-listener",
        "path": "/ws/telemetry",
        "wholemsg": "false"
    },
    {
        "id": "6937ec601d66cbd0",
        "type": "global-config",
        "env": [],
        "modules": {
            "node-red-contrib-opcua": "0.2.348"
        }
    }
]
```

</details>`

1. Clone the repository
2. Run `npm install`
3. Start local development server with `npm run dev`
4. Ensure your Node-RED node is actively pushing objects containing at least a `sensor`, `value`, and `timestamp` key (Feel free to copy-paste the provided Node-RED flow to test the React app).

## Tech Stack
- React 18
- Vite
- Recharts
- Tailwind CSS
