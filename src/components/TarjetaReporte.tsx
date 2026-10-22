import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Reporte } from '@/lib/reportesStore';

interface PropsTarjetaReporte {
  reporte: Reporte;
  onPress: () => void;
}

export default function TarjetaReporte({ reporte, onPress }: PropsTarjetaReporte) {
  const colorEstado =
    reporte.estado === 'resuelto'
      ? { fondo: '#DCFCE7', texto: '#166534', etiqueta: 'Resuelto' }
      : reporte.estado === 'en curso'
        ? { fondo: '#FEF3C7', texto: '#92400E', etiqueta: 'En curso' }
        : { fondo: '#FEE2E2', texto: '#991B1B', etiqueta: 'Pendiente' };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.categoria}>{reporte.categoria.toUpperCase()}</Text>
        <View style={[styles.estadoBadge, { backgroundColor: colorEstado.fondo }]}>
          <Text style={[styles.estadoTexto, { color: colorEstado.texto }]}>
            {colorEstado.etiqueta}
          </Text>
        </View>
      </View>

      <Text style={styles.titulo}>{reporte.titulo}</Text>
      <Text style={styles.aula}>Aula / lugar: {reporte.aula}</Text>

      {reporte.ubicacion ? (
        <Text style={styles.meta}>
          Ubicación: {reporte.ubicacion.detalleTexto}
        </Text>
      ) : null}

      <View style={styles.footerRow}>
        <Text style={styles.fecha}>{reporte.fechaCreacion}</Text>
        <Text style={styles.verDetalle}>Ver detalle</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoria: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  estadoTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  aula: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  fecha: {
    fontSize: 12,
    color: '#64748B',
  },
  verDetalle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D4ED8',
  },
});
