import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { ReportesProvider } from '@/lib/reportesStore';

export default function RootLayout() {
  return (
    <ReportesProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#1E3A8A' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: '#F8FAFC' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="reporte/nuevo"
          options={{ title: 'Nuevo reporte' }}
        />
        <Stack.Screen
          name="reporte/escanear"
          options={{ title: 'Escanear QR del aula' }}
        />
        <Stack.Screen
          name="reporte/foto"
          options={{ title: 'Adjuntar foto' }}
        />
        <Stack.Screen
          name="reporte/ubicacion"
          options={{ title: 'Marcar ubicación' }}
        />
        <Stack.Screen
          name="reporte/[id]"
          options={{ title: 'Detalle del reporte' }}
        />
        <Stack.Screen
          name="permisos/[recurso]"
          options={{
            title: 'Permiso requerido',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="ajustes-app"
          options={{ title: 'Ajustes de avisos' }}
        />
      </Stack>
    </ReportesProvider>
  );
}
