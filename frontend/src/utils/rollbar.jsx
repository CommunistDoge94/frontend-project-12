import { Provider as RollbarProvider } from '@rollbar/react'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
  codeVersion: import.meta.env.VITE_ROLLBAR_CODE_VERSION,
}

export const Rollbar = ({ children }) => (
  <RollbarProvider config={rollbarConfig}>
    {children}
  </RollbarProvider>
)
