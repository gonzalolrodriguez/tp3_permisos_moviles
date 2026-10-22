import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import TarjetaReporte from '@/components/TarjetaReporte';
import { useReportes } from '@/lib/reportesStore';

export default function InicioReportesScreen() {
  const router = useRouter();
  const { reportes } = useReportes();

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitulo}>
          Sistema de Mantenimiento Edilicio - IPF
        </Text>
        <Text style={styles.bannerSubtitulo}>
          Reportá desperfectos de electricidad, agua, mobiliario o equipos del Instituto. Esta pantalla inicial no solicita ningún permiso.
        </Text>
        <View style={styles.accionesBanner}>
          <Pressable
            style={styles.botonNuevo}
            onPress={() => router.push('/reporte/nuevo')}
          >
            <Text style={styles.textoBotonNuevo}>Nuevo reporte</Text>
          </Pressable>
          <Pressable
            style={styles.botonSecundario}
            onPress={() => router.push('/ajustes-app')}
          >
            <Text style={styles.textoBotonSecundario}>Ajustes de avisos</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.seccionTitulo}>
        Mis reportes ({reportes.length})
      </Text>

      <FlatList
        data={reportes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <TarjetaReporte
            reporte={item}
            onPress={() => router.push(`/reporte/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            Todavía no cargaste ningún reporte. Tocá Nuevo reporte para comenzar.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 16,
  },
  bannerTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  bannerSubtitulo: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
    marginBottom: 14,
  },
  accionesBanner: {
    flexDirection: 'row',
    gap: 10,
  },
  botonNuevo: {
    flex: 1,
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonNuevo: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  botonSecundario: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBotonSecundario: {
    color: '#1E293B',
    fontSize: 13,
    fontWeight: '600',
  },
  seccionTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  lista: {
    paddingBottom: 24,
  },
  vacio: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 32,
    fontSize: 14,
  },
});
