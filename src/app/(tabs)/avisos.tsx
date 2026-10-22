import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useReportes } from '@/lib/reportesStore';

export default function BandejaAvisosScreen() {
  const router = useRouter();
  const { avisos, marcarAvisoLeido } = useReportes();

  return (
    <View style={styles.container}>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitulo}>
          Alternativa a las notificaciones del sistema
        </Text>
        <Text style={styles.infoTexto}>
          En esta bandeja interna se registran todos los cambios de estado cuando se resuelve un reporte. Si preferís no conceder el permiso de notificaciones, podés consultar tus avisos acá sin perder funcionalidad.
        </Text>
      </View>

      <FlatList
        data={avisos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View
            style={[
              styles.avisoCard,
              !item.leido ? styles.avisoNoLeido : null,
            ]}
          >
            <View style={styles.headerRow}>
              <Text style={styles.fecha}>{item.fecha}</Text>
              <Text style={styles.estadoLectura}>
                {item.leido ? 'Leído' : 'Nuevo aviso'}
              </Text>
            </View>

            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.mensaje}>{item.mensaje}</Text>

            <View style={styles.accionesRow}>
              <Pressable
                style={styles.botonVer}
                onPress={() => {
                  marcarAvisoLeido(item.id);
                  router.push(`/reporte/${item.reporteId}`);
                }}
              >
                <Text style={styles.textoBotonVer}>Ver reporte asociado</Text>
              </Pressable>

              {!item.leido ? (
                <Pressable
                  style={styles.botonMarcar}
                  onPress={() => marcarAvisoLeido(item.id)}
                >
                  <Text style={styles.textoBotonMarcar}>Marcar como leído</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            No tenés avisos registrados por el momento.
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
  infoBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  infoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  infoTexto: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1E40AF',
  },
  lista: {
    paddingBottom: 24,
  },
  avisoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  avisoNoLeido: {
    borderColor: '#2563EB',
    borderLeftWidth: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  fecha: {
    fontSize: 12,
    color: '#64748B',
  },
  estadoLectura: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  mensaje: {
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
    marginBottom: 12,
  },
  accionesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  botonVer: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoBotonVer: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  botonMarcar: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  textoBotonMarcar: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '600',
  },
  vacio: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 32,
    fontSize: 14,
  },
});
