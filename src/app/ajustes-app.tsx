import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { usePermiso } from '@/hooks/usePermiso';
import { obtenerCaminoAjustes } from '@/lib/permisos';
import { useReportes } from '@/lib/reportesStore';

export default function AjustesAppScreen() {
  const router = useRouter();
  const { avisarmeAlResolver, setAvisarmeAlResolver } = useReportes();
  const permisoNotificaciones = usePermiso('notificaciones');

  const cambiarInterruptor = async (nuevoValor: boolean) => {
    if (!nuevoValor) {
      setAvisarmeAlResolver(false);
      return;
    }

    // Guardamos la preferencia. El interruptor solo se ve activo
    // cuando el permiso está concedido.
    setAvisarmeAlResolver(true);

    if (permisoNotificaciones.estado === 'concedido') {
      return;
    }

    // Pantalla previa explicativa: ahi se crea el canal y se pide el permiso
    router.push('/permisos/notificaciones');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Preferencias de avisos</Text>
        <Text style={styles.descripcion}>
          El permiso de notificaciones se solicita únicamente en contexto cuando activás este interruptor. En Android se crea primero el canal reportes antes de mostrar el diálogo.
        </Text>

        <View style={styles.filaSwitch}>
          <View style={styles.textoSwitchContainer}>
            <Text style={styles.etiquetaSwitch}>
              Avisarme cuando se resuelva mi reporte
            </Text>
            <Text style={styles.subtextoSwitch}>
              Estado del permiso: {permisoNotificaciones.estado}
            </Text>
          </View>
          <Switch
            value={avisarmeAlResolver && permisoNotificaciones.estado === 'concedido'}
            onValueChange={cambiarInterruptor}
            trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
            thumbColor={
              avisarmeAlResolver && permisoNotificaciones.estado === 'concedido'
                ? '#1D4ED8'
                : '#64748B'
            }
          />
        </View>

        {permisoNotificaciones.estado === 'bloqueado' ? (
          <View style={styles.avisoBloqueado}>
            <Text style={styles.avisoBloqueadoTitulo}>
              Notificaciones bloqueadas en el dispositivo
            </Text>
            <Text style={styles.avisoBloqueadoTexto}>
              Para recibir alertas fuera de la app, habilitalas en: {obtenerCaminoAjustes('notificaciones')}
            </Text>
            <Pressable
              style={styles.botonAjustes}
              onPress={permisoNotificaciones.abrirAjustes}
            >
              <Text style={styles.textoBotonAjustes}>Abrir Ajustes</Text>
            </Pressable>
          </View>
        ) : null}

        <View style={styles.alternativaBox}>
          <Text style={styles.alternativaTitulo}>
            Camino alternativo siempre activo
          </Text>
          <Text style={styles.alternativaTexto}>
            Aunque desactives este interruptor o rechaces el permiso de notificaciones, cada vez que se resuelva un desperfecto vas a encontrar el mensaje en la pestaña Avisos dentro de la app.
          </Text>
          <Pressable
            style={styles.botonIrAvisos}
            onPress={() => router.push('/avisos')}
          >
            <Text style={styles.textoBotonIrAvisos}>Ir a la bandeja de Avisos</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
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
    marginBottom: 18,
  },
  filaSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  textoSwitchContainer: {
    flex: 1,
    paddingRight: 12,
  },
  etiquetaSwitch: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  subtextoSwitch: {
    fontSize: 12,
    color: '#64748B',
  },
  avisoBloqueado: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  avisoBloqueadoTitulo: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  avisoBloqueadoTexto: {
    fontSize: 12,
    lineHeight: 18,
    color: '#7F1D1D',
    marginBottom: 10,
  },
  botonAjustes: {
    alignSelf: 'flex-start',
    backgroundColor: '#B45309',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoBotonAjustes: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  alternativaBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  alternativaTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  alternativaTexto: {
    fontSize: 13,
    lineHeight: 18,
    color: '#1E40AF',
    marginBottom: 10,
  },
  botonIrAvisos: {
    alignSelf: 'flex-start',
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  textoBotonIrAvisos: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
