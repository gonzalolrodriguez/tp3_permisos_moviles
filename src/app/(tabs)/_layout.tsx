import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { useReportes } from '@/lib/reportesStore';

export default function TabsLayout() {
  const router = useRouter();
  const { avisos } = useReportes();
  const noLeidos = avisos.filter((item) => !item.leido).length;

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#1E3A8A' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: '#1D4ED8',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#CBD5E1',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Reportes',
          headerTitle: 'Mantenimiento IPF',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabMarker, { color }]}>[R]</Text>
          ),
          headerRight: () => (
            <Pressable
              style={styles.botonAjustesHeader}
              onPress={() => router.push('/ajustes-app')}
            >
              <Text style={styles.textoAjustesHeader}>Ajustes</Text>
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="avisos"
        options={{
          title: 'Avisos',
          headerTitle: 'Bandeja de avisos',
          tabBarBadge: noLeidos > 0 ? noLeidos : undefined,
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabMarker, { color }]}>[A]</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="permisos"
        options={{
          title: 'Permisos',
          headerTitle: 'Panel de permisos',
          tabBarIcon: ({ color }) => (
            <Text style={[styles.tabMarker, { color }]}>[P]</Text>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabMarker: {
    fontSize: 13,
    fontWeight: '700',
  },
  botonAjustesHeader: {
    marginRight: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  textoAjustesHeader: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
