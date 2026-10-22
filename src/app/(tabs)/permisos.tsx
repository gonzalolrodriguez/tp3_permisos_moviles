import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import FilaPermiso from '@/components/FilaPermiso';
import { usePermiso } from '@/hooks/usePermiso';

export default function PanelPermisosScreen() {
  const router = useRouter();
  const permisoCamara = usePermiso('camara');
  const permisoUbicacion = usePermiso('ubicacion');
  const permisoNotificaciones = usePermiso('notificaciones');

  const refrescarTodos = async () => {
    await Promise.all([
      permisoCamara.consultar(),
      permisoUbicacion.consultar(),
      permisoNotificaciones.consultar(),
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.resumenBox}>
        <Text style={styles.resumenTitulo}>
          Estado de permisos en {Platform.OS === 'ios' ? 'iOS' : 'Android'} ({Platform.OS})
        </Text>
        <Text style={styles.resumenTexto}>
          Este panel consulta el estado real devuelto por el sistema operativo y se actualiza automáticamente al regresar desde Ajustes mediante AppState.
        </Text>
        <Pressable style={styles.botonRefrescar} onPress={refrescarTodos}>
          <Text style={styles.textoBotonRefrescar}>Volver a consultar estado</Text>
        </Pressable>
      </View>

      <FilaPermiso
        recurso="camara"
        estado={permisoCamara.estado}
        parcial={permisoCamara.parcial}
        matiz={permisoCamara.matiz}
        onPedirConPantallaPrevia={() => router.push('/permisos/camara')}
        onAbrirAjustes={permisoCamara.abrirAjustes}
      />

      <FilaPermiso
        recurso="ubicacion"
        estado={permisoUbicacion.estado}
        parcial={permisoUbicacion.parcial}
        matiz={permisoUbicacion.matiz}
        onPedirConPantallaPrevia={() => router.push('/permisos/ubicacion')}
        onAbrirAjustes={permisoUbicacion.abrirAjustes}
      />

      <FilaPermiso
        recurso="notificaciones"
        estado={permisoNotificaciones.estado}
        parcial={permisoNotificaciones.parcial}
        matiz={permisoNotificaciones.matiz}
        onPedirConPantallaPrevia={() => router.push('/ajustes-app')}
        onAbrirAjustes={permisoNotificaciones.abrirAjustes}
      />

      <View style={styles.galeriaBox}>
        <Text style={styles.galeriaTitulo}>
          Fotos de la galería (Selector del sistema)
        </Text>
        <Text style={styles.galeriaDetalle}>
          Módulo: expo-image-picker (launchImageLibraryAsync) | Permiso declarado: ninguno
        </Text>
        <Text style={styles.galeriaTexto}>
          Siguiendo el principio de mínimo privilegio, la aplicación no declara READ_MEDIA_IMAGES ni pide permiso de galería. El usuario elige solo la foto del desperfecto con el Photo Picker del sistema.
        </Text>
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
  resumenBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  resumenTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  resumenTexto: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
    marginBottom: 12,
  },
  botonRefrescar: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoBotonRefrescar: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },
  galeriaBox: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  galeriaTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  galeriaDetalle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803D',
    marginBottom: 6,
  },
  galeriaTexto: {
    fontSize: 13,
    lineHeight: 18,
    color: '#166534',
  },
});
