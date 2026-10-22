import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  EstadoPermiso,
  INFO_RECURSOS,
  obtenerCaminoAjustes,
  RecursoPermiso,
} from '@/lib/permisos';

interface PropsFilaPermiso {
  recurso: RecursoPermiso;
  estado: EstadoPermiso;
  parcial: boolean;
  matiz: string | null;
  onPedirConPantallaPrevia: () => void;
  onAbrirAjustes: () => void;
}

export default function FilaPermiso({
  recurso,
  estado,
  parcial,
  matiz,
  onPedirConPantallaPrevia,
  onAbrirAjustes,
}: PropsFilaPermiso) {
  const info = INFO_RECURSOS[recurso];

  const obtenerEtiquetaEstado = () => {
    if (estado === 'cargando') {
      return { texto: 'Cargando', fondo: '#E2E8F0', color: '#334155' };
    }
    if (estado === 'concedido') {
      if (parcial) {
        return { texto: 'Parcial / Aproximado', fondo: '#FEF3C7', color: '#92400E' };
      }
      return { texto: 'Concedido', fondo: '#DCFCE7', color: '#166534' };
    }
    if (estado === 'preguntable') {
      return { texto: 'Preguntable', fondo: '#DBEAFE', color: '#1E40AF' };
    }
    return { texto: 'Bloqueado', fondo: '#FEE2E2', color: '#991B1B' };
  };

  const badge = obtenerEtiquetaEstado();

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>{info.titulo}</Text>
          <Text style={styles.modulo}>Módulo: {info.modulo}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: badge.fondo }]}>
          <Text style={[styles.badgeTexto, { color: badge.color }]}>
            {badge.texto}
          </Text>
        </View>
      </View>

      <Text style={styles.detalle}>
        Plataforma actual: <Text style={styles.negrita}>{Platform.OS}</Text> | Estado base:{' '}
        <Text style={styles.negrita}>{estado}</Text> | Parcial:{' '}
        <Text style={styles.negrita}>{parcial ? 'sí' : 'no'}</Text>
      </Text>

      {matiz ? (
        <Text style={styles.matiz}>Matiz detectado: {matiz}</Text>
      ) : (
        <Text style={styles.matiz}>Matiz detectado: sin matiz activo</Text>
      )}

      <Text style={styles.alternativa}>Alternativa: {info.alternativa}</Text>

      {estado === 'bloqueado' ? (
        <Text style={styles.caminoBloqueo}>
          Camino en Ajustes: {obtenerCaminoAjustes(recurso)}
        </Text>
      ) : null}

      <View style={styles.botonesRow}>
        {estado === 'preguntable' ? (
          <Pressable style={styles.botonPedir} onPress={onPedirConPantallaPrevia}>
            <Text style={styles.textoBoton}>
              {recurso === 'notificaciones'
                ? 'Ir a Ajustes de avisos'
                : 'Ver pantalla previa y pedir'}
            </Text>
          </Pressable>
        ) : null}

        {(estado === 'bloqueado' || estado === 'concedido') ? (
          <Pressable style={styles.botonAjustes} onPress={onAbrirAjustes}>
            <Text style={styles.textoBoton}>Abrir Ajustes del sistema</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  modulo: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeTexto: {
    fontSize: 12,
    fontWeight: '700',
  },
  detalle: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 4,
  },
  negrita: {
    fontWeight: '700',
  },
  matiz: {
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '600',
    marginBottom: 6,
  },
  alternativa: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  caminoBloqueo: {
    fontSize: 12,
    color: '#991B1B',
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  botonesRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  botonPedir: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  botonAjustes: {
    backgroundColor: '#475569',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
