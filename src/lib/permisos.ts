import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Linking, Platform } from 'react-native';

// En Expo Go para Android, importar expo-notifications hace fallar toda la app,
// porque a Expo Go le falta un módulo nativo de notificaciones push
// (ExpoTopicSubscriptionModule). Por eso lo cargamos dentro de un try/catch:
// si no se puede cargar, la app sigue funcionando y los avisos van a /avisos.
function cargarNotificaciones(): typeof import('expo-notifications') | null {
  try {
    return require('expo-notifications');
  } catch {
    return null;
  }
}

const Notifications = cargarNotificaciones();

export type RecursoPermiso = 'camara' | 'ubicacion' | 'notificaciones';

export type EstadoPermiso = 'cargando' | 'concedido' | 'preguntable' | 'bloqueado';

export interface ResultadoPermiso {
  estado: EstadoPermiso;
  parcial: boolean;
  matiz: string | null;
}

export interface InfoRecurso {
  recurso: RecursoPermiso;
  titulo: string;
  modulo: string;
  beneficio: string;
  cuandoSePide: string;
  alternativa: string;
  caminoAndroid: string;
  caminoIOS: string;
}

export interface DatosUbicacion {
  latitud: number;
  longitud: number;
  aproximada: boolean;
}

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const INFO_RECURSOS: Record<RecursoPermiso, InfoRecurso> = {
  camara: {
    recurso: 'camara',
    titulo: 'Cámara',
    modulo: 'expo-camera / expo-image-picker',
    beneficio:
      'Usamos tu cámara para escanear el código QR del aula y sacar fotos del desperfecto a reportar.',
    cuandoSePide:
      'Al tocar Escanear QR del aula o al elegir Sacar foto con la cámara dentro de un nuevo reporte.',
    alternativa:
      'Escribir el código del aula a mano o adjuntar una foto desde el selector del sistema sin permiso.',
    caminoAndroid:
      'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Cámara > Permitir solo mientras la app está en uso',
    caminoIOS:
      'Ajustes > Mantenimiento IPF > Cámara > Activar el interruptor',
  },
  ubicacion: {
    recurso: 'ubicacion',
    titulo: 'Ubicación en primer plano',
    modulo: 'expo-location',
    beneficio:
      'Usamos tu ubicación para identificar el sector del edificio donde se encuentra el desperfecto.',
    cuandoSePide:
      'Al tocar Obtener ubicación actual dentro de la pantalla de ubicación del reporte.',
    alternativa:
      'Elegir el sector del edificio a mano (Patio, Estacionamiento o Pasillo).',
    caminoAndroid:
      'Ajustes > Aplicaciones > Mantenimiento IPF > Permisos > Ubicación > Permitir solo mientras la app está en uso',
    caminoIOS:
      'Ajustes > Mantenimiento IPF > Ubicación > Al usar la app',
  },
  notificaciones: {
    recurso: 'notificaciones',
    titulo: 'Notificaciones',
    modulo: 'expo-notifications',
    beneficio:
      'Usamos las notificaciones para avisarte cuando el equipo de mantenimiento resuelva tu reporte.',
    cuandoSePide:
      'Al activar el interruptor Avisarme cuando se resuelva mi reporte en Ajustes de la app.',
    alternativa:
      'Consultar el estado y los avisos en la pestaña Avisos dentro de la aplicación.',
    caminoAndroid:
      'Ajustes > Aplicaciones > Mantenimiento IPF > Notificaciones > Permitir notificaciones',
    caminoIOS:
      'Ajustes > Mantenimiento IPF > Notificaciones > Permitir notificaciones',
  },
};

export function esRecursoValido(valor: string | undefined): valor is RecursoPermiso {
  return valor === 'camara' || valor === 'ubicacion' || valor === 'notificaciones';
}

export function obtenerCaminoAjustes(recurso: RecursoPermiso): string {
  const info = INFO_RECURSOS[recurso];
  return Platform.OS === 'ios' ? info.caminoIOS : info.caminoAndroid;
}

export async function asegurarCanalReportes(): Promise<void> {
  if (Notifications && Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reportes', {
      name: 'Resoluciones de reportes',
      description: 'Avisos cuando un desperfecto reportado cambia a resuelto',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

// Convierte la respuesta del sistema en uno de los 3 estados reales.
export function calcularEstado(respuesta: {
  granted: boolean;
  canAskAgain: boolean;
}): EstadoPermiso {
  if (respuesta.granted) {
    return 'concedido';
  }
  if (respuesta.canAskAgain) {
    return 'preguntable';
  }
  return 'bloqueado';
}

// Ubicacion aproximada: Android 'coarse', iOS 'reduced' (campos de la respuesta del permiso).
export function esUbicacionAproximada(permiso: Location.LocationPermissionResponse): boolean {
  return permiso.android?.accuracy === 'coarse' || permiso.ios?.accuracy === 'reduced';
}

export async function consultarPermisoRecurso(
  recurso: RecursoPermiso
): Promise<ResultadoPermiso> {
  try {
    if (recurso === 'camara') {
      const res = await Camera.getCameraPermissionsAsync();
      return { estado: calcularEstado(res), parcial: false, matiz: null };
    }

    if (recurso === 'ubicacion') {
      const res = await Location.getForegroundPermissionsAsync();
      const aproximada = res.granted && esUbicacionAproximada(res);

      let matiz: string | null = null;
      if (res.granted) {
        matiz = aproximada ? 'precision: aproximada' : 'precision: exacta';
      }

      return { estado: calcularEstado(res), parcial: aproximada, matiz };
    }

    // Si expo-notifications no se pudo cargar (Expo Go en Android),
    // no se puede pedir el permiso: los avisos se ven en /avisos.
    if (!Notifications) {
      return { estado: 'bloqueado', parcial: false, matiz: 'no disponible en Expo Go' };
    }

    const res = await Notifications.getPermissionsAsync();
    return { estado: calcularEstado(res), parcial: false, matiz: null };
  } catch {
    return { estado: 'preguntable', parcial: false, matiz: null };
  }
}

export async function solicitarPermisoRecurso(
  recurso: RecursoPermiso
): Promise<ResultadoPermiso> {
  try {
    if (recurso === 'camara') {
      await Camera.requestCameraPermissionsAsync();
    } else if (recurso === 'ubicacion') {
      await Location.requestForegroundPermissionsAsync();
    } else if (Notifications) {
      // En Android el canal se crea ANTES de pedir el permiso
      await asegurarCanalReportes();
      await Notifications.requestPermissionsAsync();
    }
  } catch {
    // Si falla el pedido, igual consultamos el estado real
  }
  return consultarPermisoRecurso(recurso);
}

export async function abrirAjustesSistema(): Promise<void> {
  await Linking.openSettings();
}

export async function obtenerUbicacion(): Promise<DatosUbicacion | null> {
  try {
    const permiso = await Location.getForegroundPermissionsAsync();
    if (!permiso.granted) {
      return null;
    }

    const posicion = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitud: posicion.coords.latitude,
      longitud: posicion.coords.longitude,
      aproximada: esUbicacionAproximada(permiso),
    };
  } catch {
    return null;
  }
}

export async function programarNotificacionResolucion(
  tituloReporte: string,
  aula: string
): Promise<boolean> {
  if (!Notifications) {
    return false;
  }

  try {
    const estadoNotif = await consultarPermisoRecurso('notificaciones');
    if (estadoNotif.estado !== 'concedido') {
      return false;
    }

    await asegurarCanalReportes();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reporte resuelto - Mantenimiento IPF',
        body: `Se resolvió el desperfecto "${tituloReporte}" en ${aula}.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
        channelId: 'reportes',
      },
    });

    return true;
  } catch {
    return false;
  }
}
