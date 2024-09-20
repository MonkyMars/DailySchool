import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Analytics } from "@vercel/analytics/react"
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
      <Analytics />
    </SessionProvider>
    </>
  )
}

export default MyApp
