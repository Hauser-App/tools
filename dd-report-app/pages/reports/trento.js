import Head from 'next/head'
import HauserEQTrento from '../../components/HauserEQ-Trento'

export default function TrentoReport() {
  return (
    <>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <HauserEQTrento />
    </>
  )
}