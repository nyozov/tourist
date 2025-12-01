import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import Nav from "./components/Nav";
import { Metadata } from 'next'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'TripPlanner',
    template: '%s | TripPlanner'
  },
  description: 'Your travel planning companion',
  keywords: ['travel', 'trip planner', 'itinerary'],
  openGraph: {
    siteName: 'TripPlanner',
  }
}

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
