import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "../context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "WhatsApp Web Clone",
  description: "Full-stack WhatsApp Web clone with real-time messaging",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SocketProvider>
          {children}
        </SocketProvider>
      </body>
    </html>
  );
}
