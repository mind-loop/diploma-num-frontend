// src/pages/_app.tsx (Шинэчилсэн)
import '../styles/globals.css';
import '@mantine/core/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications'; // 💡 Нэмэгдсэн
import '@mantine/notifications/styles.css'; // 💡 Нэмэгдсэн styles
import '@mantine/dates/styles.css';
import type { AppProps } from 'next/app';

import { AuthProvider } from '../context/AuthContext'; // 💡 Нэмэгдсэн
import { RoomProvider } from '@/context/RoomContext';

const theme = createTheme({
  fontFamily: 'Roboto, sans-serif', 
  primaryColor: 'blue',  
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {/* Notifications-ийг MantineProvider дотор нэмнэ */}
      <Notifications position="top-right" zIndex={2000} /> 
      <RoomProvider>
        <AuthProvider> 
        <Component {...pageProps} />
      </AuthProvider>
      </RoomProvider>
    </MantineProvider>
  );
}