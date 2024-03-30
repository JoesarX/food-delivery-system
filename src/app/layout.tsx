"use client"
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import HomeShortcuts from '@/components/MenuShortcuts'
import './globals.css'
//import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
//import { metadata } from '@/utils/metadata'
import Head from 'next/head';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import AuthProvider from '@/components/AuthProvider'
import QueryProvider from '@/components/QueryProvider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })



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
                <Footer />
                <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
              </div>
            </QueryProvider>
          </AuthProvider>
          <SpeedInsights />
          <Analytics />
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
              <div className='sticky top-0 z-40'>
                <NavBar />
                <HomeShortcuts />
              </div>
              {children}
              <Footer />
              <ToastContainer position="bottom-right" theme="dark" autoClose={3000} />
            </div>
          </QueryProvider>
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
