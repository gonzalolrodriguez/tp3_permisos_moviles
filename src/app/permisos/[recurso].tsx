import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import ExplicacionPermiso from '@/components/ExplicacionPermiso';
import { usePermiso } from '@/hooks/usePermiso';
import { esRecursoValido, INFO_RECURSOS, RecursoPermiso } from '@/lib/permisos';
import { useReportes } from '@/lib/reportesStore';

function ContenidoModalPermiso({ recurso }: { recurso: RecursoPermiso }) {
  const router = useRouter();
  const { estado, pedir, abrirAjustes } = usePermiso(recurso);
  const { setAvisarmeAlResolver } = useReportes();
  const info = INFO_RECURSOS[recurso];

  if (estado === 'cargando') {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text style={styles.cargandoTexto}>
          Consultando estado del permiso...
        </Text>
      </View>
    );
  }

  const manejarContinuar = async () => {
    const resultado = await pedir();
    if (recurso === 'notificaciones' && resultado.estado === 'concedido') {
      setAvisarmeAlResolver(true);
    }
    if (router.canGoBack()) {
      router.back();
    }
  };

  const manejarAbrirAjustes = async () => {
    await abrirAjustes();
  };

  return (
    <View style={styles.container}>
      <ExplicacionPermiso
        recurso={recurso}
        estado={estado}
        onContinuar={manejarContinuar}
        onAbrirAjustes={manejarAbrirAjustes}
      >
        <Text style={styles.notaAlternativa}>
          Alternativa disponible en la app: {info.alternativa}
        </Text>
      </ExplicacionPermiso>
    </View>
  );
}

export default function PantallaPreviaPermisoModal() {
  const { recurso } = useLocalSearchParams<{ recurso?: string }>();

  if (!esRecursoValido(recurso)) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.errorTitulo}>Recurso de permiso no válido</Text>
        <Text style={styles.errorTexto}>
          El recurso solicitado ({String(recurso)}) no existe. Los recursos válidos son: camara, ubicacion y notificaciones.
        </Text>
      </View>
    );
  }

  return <ContenidoModalPermiso recurso={recurso} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    justifyContent: 'center',
  },
  centrado: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cargandoTexto: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
  notaAlternativa: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
  },
  errorTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 8,
  },
  errorTexto: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
  },
});
