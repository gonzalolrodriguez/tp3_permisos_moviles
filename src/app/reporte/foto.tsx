import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { usePermiso } from '@/hooks/usePermiso';
import { useReportes } from '@/lib/reportesStore';

export default function AdjuntarFotoScreen() {
  const router = useRouter();
  const { borrador, actualizarBorrador } = useReportes();
  const permisoCamara = usePermiso('camara');
  const [mensaje, setMensaje] = useState<string | null>(null);

  const elegirDeGaleriaSinPermiso = async () => {
    setMensaje(null);
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets[0]?.uri) {
      actualizarBorrador({ fotoUri: resultado.assets[0].uri });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/reporte/nuevo');
      }
    }
  };

  const sacarFotoConCamara = async () => {
    setMensaje(null);

    if (permisoCamara.estado !== 'concedido') {
      router.push('/permisos/camara');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!resultado.canceled && resultado.assets[0]?.uri) {
      actualizarBorrador({ fotoUri: resultado.assets[0].uri });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/reporte/nuevo');
      }
    } else {
      setMensaje('No se tomó ninguna foto.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Adjuntar foto del desperfecto</Text>
        <Text style={styles.descripcion}>
          Podés elegir una imagen puntual usando el selector del sistema sin conceder permiso de galería, o bien sacar una foto en el momento con la cámara.
        </Text>

        <View style={styles.opcionBox}>
          <Text style={styles.opcionTitulo}>
            Opción recomendada: Selector del sistema (sin permiso)
          </Text>
          <Text style={styles.opcionTexto}>
            Usa ImagePicker.launchImageLibraryAsync. La aplicación no declara READ_MEDIA_IMAGES ni accede al resto de tu galería privada.
          </Text>
          <Pressable
            style={styles.botonGaleria}
            onPress={elegirDeGaleriaSinPermiso}
          >
            <Text style={styles.textoBoton}>Elegir de la galería</Text>
          </Pressable>
        </View>

        <View style={styles.opcionBox}>
          <Text style={styles.opcionTitulo}>
            Sacar foto en el momento (requiere permiso de cámara)
          </Text>
          <Text style={styles.opcionTexto}>
            Estado actual de la cámara: {permisoCamara.estado}. Si todavía no está concedido, al tocar el botón verás primero la pantalla previa explicativa.
          </Text>
          <Pressable style={styles.botonCamara} onPress={sacarFotoConCamara}>
            <Text style={styles.textoBoton}>Sacar foto</Text>
          </Pressable>
        </View>

        {mensaje ? <Text style={styles.mensaje}>{mensaje}</Text> : null}

        {borrador.fotoUri ? (
          <View style={styles.actualBox}>
            <Text style={styles.actualTitulo}>Foto seleccionada actualmente:</Text>
            <Image
              source={{ uri: borrador.fotoUri }}
              style={styles.previewImagen}
            />
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
    marginBottom: 16,
  },
  opcionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  opcionTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  opcionTexto: {
    fontSize: 12,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 12,
  },
  botonGaleria: {
    backgroundColor: '#15803D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonCamara: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  mensaje: {
    fontSize: 13,
    color: '#475569',
    marginTop: 8,
  },
  actualBox: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  actualTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  previewImagen: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
});
