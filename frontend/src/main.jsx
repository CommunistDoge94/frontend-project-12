import { createRoot } from 'react-dom/client'
import appInit from './appInit.jsx'
import socket from './socket.js'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(appInit(socket))