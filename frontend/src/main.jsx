import { createRoot } from 'react-dom/client'

import appInit from './appInit.jsx'

const container = document.getElementById('root')
const root = createRoot(container)

root.render(appInit())
