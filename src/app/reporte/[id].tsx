import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useReportes } from '@/lib/reportesStore';

export default function DetalleReporteScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { obtenerReportePorId, simularResolucion } = useReportes();
  const [resultadoSimulacion, setResultadoSimulacion] = useState<string | null>(
    null
  );

  const idLimpio = typeof id === 'string' ? id.trim() : '';
  const reporte = idLimpio ? obtenerReportePorId(idLimpio) : undefined;

  if (!idLimpio || !reporte) {
    return (
      <View style={styles.noExisteContainer}>
        <Text style={styles.noExisteTitulo}>Reporte no encontrado</Text>
        <Text style={styles.noExisteTexto}>
          No existe ningún reporte registrado con el identificador "{String(id)}". Verificá el enlace o volvé al listado principal.
        </Text>
        <Pressable
          style={styles.botonVolver}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.textoBotonVolver}>Volver a Reportes</Text>
        </Pressable>
      </View>
    );
  }

  const ejecutarSimulacion = async () => {
    const res = await simularResolucion(reporte.id);
    if (res.notificacionProgramada) {
      setResultadoSimulacion(
        'El reporte pasó a Resuelto. Se programó una notificación local para dentro de 10 segundos.'
      );
    } else {
      setResultadoSimulacion(
        'El reporte pasó a Resuelto. Como el permiso de notificaciones no está concedido, el aviso se guardó directamente en la pestaña Avisos.'
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.categoria}>{reporte.categoria.toUpperCase()}</Text>
          <Text style={styles.estado}>Estado: {reporte.estado.toUpperCase()}</Text>
        </View>

        <Text style={styles.titulo}>{reporte.titulo}</Text>
        <Text style={styles.fecha}>Cargado el {reporte.fechaCreacion}</Text>

        <View style={styles.bloqueDato}>
          <Text style={styles.etiqueta}>Aula / Dependencia</Text>
          <Text style={styles.valor}>{reporte.aula}</Text>
        </View>

        <View style={styles.bloqueDato}>
          <Text style={styles.etiqueta}>Descripción del desperfecto</Text>
          <Text style={styles.valor}>{reporte.descripcion}</Text>
        </View>

        <View style={styles.bloqueDato}>
          <Text style={styles.etiqueta}>Ubicación / Sector</Text>
          <Text style={styles.valor}>
            {reporte.ubicacion
              ? reporte.ubicacion.detalleTexto
              : 'Sin sector especificado'}
          </Text>
        </View>

        {reporte.fotoUri ? (
          <View style={styles.bloqueDato}>
            <Text style={styles.etiqueta}>Foto adjunta</Text>
            <Image
              source={{ uri: reporte.fotoUri }}
              style={styles.imagenReporte}
            />
          </View>
        ) : (
          <View style={styles.bloqueDato}>
            <Text style={styles.etiqueta}>Foto adjunta</Text>
            <Text style={styles.valorSecundario}>
              Este reporte fue cargado sin foto.
            </Text>
          </View>
        )}

        <View style={styles.separador} />

        <Text style={styles.subtituloPrueba}>
          Prueba de resolución y notificaciones
        </Text>
        <Text style={styles.descripcionPrueba}>
          Al tocar el botón se marca el desperfecto como resuelto. Si el permiso de notificaciones está concedido, programa una notificación local a los 10 segundos; si está denegado, el aviso queda disponible en /avisos.
        </Text>

        <Pressable
          style={styles.botonSimular}
          onPress={ejecutarSimulacion}
        >
          <Text style={styles.textoBotonSimular}>Simular resolución</Text>
        </Pressable>

        {resultadoSimulacion ? (
          <View style={styles.resultadoBox}>
            <Text style={styles.resultadoTexto}>{resultadoSimulacion}</Text>
            <Pressable
              style={styles.botonIrAvisos}
              onPress={() => router.push('/avisos')}
            >
              <Text style={styles.textoBotonIrAvisos}>Ver en /avisos</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  noExisteContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noExisteTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 8,
  },
  noExisteTexto: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  botonVolver: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 8,
  },
  textoBotonVolver: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoria: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  estado: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  bloqueDato: {
    marginBottom: 14,
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 3,
  },
  valor: {
    fontSize: 14,
    color: '#0F172A',
    lineHeight: 20,
  },
  valorSecundario: {
    fontSize: 13,
    color: '#64748B',
  },
  imagenReporte: {
    width: '100%',
    height: 190,
    borderRadius: 8,
    marginTop: 6,
    backgroundColor: '#E2E8F0',
  },
  separador: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  subtituloPrueba: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  descripcionPrueba: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 14,
  },
  botonSimular: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonSimular: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  resultadoBox: {
    marginTop: 14,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    padding: 12,
  },
  resultadoTexto: {
    fontSize: 13,
    lineHeight: 18,
    color: '#166534',
    marginBottom: 10,
  },
  botonIrAvisos: {
    alignSelf: 'flex-start',
    backgroundColor: '#15803D',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoBotonIrAvisos: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
