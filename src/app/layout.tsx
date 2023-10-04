"use client"
import Notification from '@/components/Notification'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import AuthProvider from '@/components/AuthProvider'
import QueryProvider from '@/components/QueryProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Los Toneles',
  description: 'La mejor comida tipica de Tegucigalpa',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <AuthProvider>
            <QueryProvider>
            <div>
              <NavBar />
              {children}
              <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
            </div>
            </QueryProvider>
          </AuthProvider>
        </body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <div>
              <Notification />
              <NavBar />
              {children}
              <Footer />
              <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
            </div>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
