import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { usePermiso } from '@/hooks/usePermiso';
import { obtenerUbicacion } from '@/lib/permisos';
import { SectorEdificio, useReportes } from '@/lib/reportesStore';

const SECTORES: { valor: SectorEdificio; etiqueta: string; detalle: string }[] = [
  {
    valor: 'patio',
    etiqueta: 'Patio',
    detalle: 'Patio central, galerías abiertas y bebederos exteriores',
  },
  {
    valor: 'estacionamiento',
    etiqueta: 'Estacionamiento',
    detalle: 'Playa de estacionamiento, luminarias exteriores y acceso',
  },
  {
    valor: 'pasillo',
    etiqueta: 'Pasillo',
    detalle: 'Pasillos internos, aulas, laboratorios y sanitarios',
  },
];

export default function UbicacionReporteScreen() {
  const router = useRouter();
  const { borrador, actualizarBorrador } = useReportes();
  const permisoUbicacion = usePermiso('ubicacion');

  const [sectorSeleccionado, setSectorSeleccionado] = useState<SectorEdificio>(
    borrador.ubicacion?.sector ?? 'pasillo'
  );
  const [cargandoGps, setCargandoGps] = useState<boolean>(false);
  const [avisoGps, setAvisoGps] = useState<string | null>(null);

  const usarUbicacionActual = async () => {
    setAvisoGps(null);

    if (permisoUbicacion.estado !== 'concedido') {
      router.push('/permisos/ubicacion');
      return;
    }

    setCargandoGps(true);
    const datos = await obtenerUbicacion();
    setCargandoGps(false);

    if (!datos) {
      setAvisoGps(
        'No se pudo obtener la ubicación con el GPS. Podés guardar el reporte eligiendo el sector a mano.'
      );
      return;
    }

    const etiquetaSector =
      SECTORES.find((s) => s.valor === sectorSeleccionado)?.etiqueta ?? 'Pasillo';

    const detalleTexto = datos.aproximada
      ? `Ubicación aproximada (Sector: ${etiquetaSector})`
      : `Ubicación precisa (${datos.latitud.toFixed(4)}, ${datos.longitud.toFixed(4)}) - Sector: ${etiquetaSector}`;

    actualizarBorrador({
      ubicacion: {
        sector: sectorSeleccionado,
        origen: 'gps',
        aproximada: datos.aproximada,
        detalleTexto,
      },
    });

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/reporte/nuevo');
    }
  };

  const guardarSectorManual = () => {
    const etiquetaSector =
      SECTORES.find((s) => s.valor === sectorSeleccionado)?.etiqueta ?? 'Pasillo';

    actualizarBorrador({
      ubicacion: {
        sector: sectorSeleccionado,
        origen: 'manual',
        aproximada: false,
        detalleTexto: `Sector elegido a mano: ${etiquetaSector}`,
      },
    });

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/reporte/nuevo');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Marcar ubicación del desperfecto</Text>
        <Text style={styles.descripcion}>
          Solo usamos ubicación en primer plano. Si elegís ubicación aproximada no se muestran coordenadas exactas, y si preferís no dar permiso podés indicar el sector a mano.
        </Text>

        <Text style={styles.subtitulo}>1. Elegí el sector del edificio</Text>
        {SECTORES.map((item) => {
          const activo = sectorSeleccionado === item.valor;
          return (
            <Pressable
              key={item.valor}
              style={[styles.sectorCard, activo ? styles.sectorActivo : null]}
              onPress={() => setSectorSeleccionado(item.valor)}
            >
              <Text
                style={[
                  styles.sectorTitulo,
                  activo ? styles.sectorTituloActivo : null,
                ]}
              >
                {item.etiqueta}
              </Text>
              <Text style={styles.sectorDetalle}>{item.detalle}</Text>
            </Pressable>
          );
        })}

        <View style={styles.separador} />

        <Text style={styles.subtitulo}>
          2. Confirmá con ubicación actual o solo con el sector manual
        </Text>
        <Text style={styles.estadoPermiso}>
          Estado del permiso de ubicación: {permisoUbicacion.estado}
          {permisoUbicacion.parcial ? ' (precisión aproximada)' : ''}
        </Text>

        {avisoGps ? (
          <View style={styles.avisoBox}>
            <Text style={styles.avisoTexto}>{avisoGps}</Text>
          </View>
        ) : null}

        <Pressable
          style={styles.botonGps}
          onPress={usarUbicacionActual}
          disabled={cargandoGps}
        >
          {cargandoGps ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.textoBoton}>
              Obtener ubicación actual en primer plano
            </Text>
          )}
        </Pressable>

        <Pressable style={styles.botonManual} onPress={guardarSectorManual}>
          <Text style={styles.textoBoton}>
            Guardar solo con el sector elegido a mano
          </Text>
        </Pressable>
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
  subtitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  sectorCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  sectorActivo: {
    borderColor: '#1D4ED8',
    backgroundColor: '#EFF6FF',
  },
  sectorTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  sectorTituloActivo: {
    color: '#1D4ED8',
  },
  sectorDetalle: {
    fontSize: 12,
    color: '#475569',
  },
  separador: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  estadoPermiso: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 12,
  },
  avisoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  avisoTexto: {
    fontSize: 12,
    color: '#92400E',
  },
  botonGps: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botonManual: {
    backgroundColor: '#15803D',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
