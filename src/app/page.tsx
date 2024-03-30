import Featured from '@/components/Featured'
import Offer from '@/components/Offer'
import Slider from '@/components/Slider'
import HomeShortcuts from '@/components/MenuShortcuts'
import Notification from '@/components/Notification'
import Head from 'next/head'


export default function Home() {
  return (
    <main>
      <Notification />
      <Slider />
      <Featured />
      {/* <Offer /> */}
    </main>
  )
}
