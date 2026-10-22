import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import ExplicacionPermiso from '@/components/ExplicacionPermiso';
import { useRevisarAlVolver } from '@/hooks/useRevisarAlVolver';
import { calcularEstado, EstadoPermiso } from '@/lib/permisos';
import { useReportes } from '@/lib/reportesStore';

export default function EscanearAulaScreen() {
  const router = useRouter();
  const { borrador, actualizarBorrador } = useReportes();
  const [permiso, pedirPermiso, consultarPermiso] = useCameraPermissions();
  const [codigoManual, setCodigoManual] = useState<string>(borrador.aula);
  const [escaneado, setEscaneado] = useState<boolean>(false);

  useRevisarAlVolver(() => {
    consultarPermiso();
  });

  const completarAulaYVolver = (valorAula: string) => {
    const limpio = valorAula.trim();
    if (!limpio) return;
    actualizarBorrador({ aula: limpio });
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/reporte/nuevo');
    }
  };

  if (!permiso) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#1D4ED8" />
        <Text style={styles.textoCargando}>
          Consultando estado del permiso de cámara...
        </Text>
      </View>
    );
  }

  const estadoActual: EstadoPermiso = calcularEstado(permiso);

  if (estadoActual === 'concedido') {
    return (
      <View style={styles.containerCamara}>
        <View style={styles.visorContainer}>
          <CameraView
            style={styles.camara}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={
              escaneado
                ? undefined
                : (resultado) => {
                    if (resultado.data) {
                      setEscaneado(true);
                      completarAulaYVolver(resultado.data);
                    }
                  }
            }
          />
          <View style={styles.guiaMarco}>
            <Text style={styles.guiaTexto}>
              Apuntá al código QR pegado en la puerta del aula
            </Text>
          </View>
        </View>

        <View style={styles.panelInferior}>
          <Pressable
            style={styles.botonSimularQR}
            onPress={() => completarAulaYVolver('Aula 104 - Laboratorio IPF')}
          >
            <Text style={styles.textoBotonSimular}>
              Simular lectura de QR (Aula 104 - Laboratorio IPF)
            </Text>
          </Pressable>

          <Text style={styles.labelManual}>
            O ingresá el código del aula a mano:
          </Text>
          <View style={styles.filaManual}>
            <TextInput
              style={styles.inputManual}
              placeholder="Ej: Aula 202 - Planta Alta"
              value={codigoManual}
              onChangeText={setCodigoManual}
            />
            <Pressable
              style={styles.botonGuardarManual}
              onPress={() => completarAulaYVolver(codigoManual)}
            >
              <Text style={styles.textoGuardarManual}>Usar aula</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ExplicacionPermiso
        recurso="camara"
        estado={estadoActual}
        onContinuar={() => {
          pedirPermiso();
        }}
        onAbrirAjustes={() => {
          Linking.openSettings();
        }}
      >
        <Text style={styles.tituloAlternativa}>
          Alternativa sin cámara: escribir el código del aula a mano
        </Text>
        <Text style={styles.descripcionAlternativa}>
          Si preferís no habilitar la cámara, podés escribir directamente el número o nombre del aula para continuar con tu reporte.
        </Text>
        <TextInput
          style={styles.inputAlternativa}
          placeholder="Ej: Aula 104 - Laboratorio de Software"
          value={codigoManual}
          onChangeText={setCodigoManual}
        />
        <Pressable
          style={styles.botonAlternativa}
          onPress={() => completarAulaYVolver(codigoManual)}
        >
          <Text style={styles.textoBotonAlternativa}>
            Guardar aula escrita a mano
          </Text>
        </Pressable>
      </ExplicacionPermiso>
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
  centrado: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  textoCargando: {
    marginTop: 12,
    fontSize: 14,
    color: '#475569',
  },
  containerCamara: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  visorContainer: {
    flex: 1,
    position: 'relative',
  },
  camara: {
    flex: 1,
  },
  guiaMarco: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  guiaTexto: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  panelInferior: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  botonSimularQR: {
    backgroundColor: '#DBEAFE',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 14,
  },
  textoBotonSimular: {
    color: '#1E40AF',
    fontSize: 13,
    fontWeight: '700',
  },
  labelManual: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  filaManual: {
    flexDirection: 'row',
    gap: 8,
  },
  inputManual: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  botonGuardarManual: {
    backgroundColor: '#15803D',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoGuardarManual: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  tituloAlternativa: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  descripcionAlternativa: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
    marginBottom: 10,
  },
  inputAlternativa: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 10,
  },
  botonAlternativa: {
    backgroundColor: '#15803D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonAlternativa: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
