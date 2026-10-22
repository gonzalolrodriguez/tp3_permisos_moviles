import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  EstadoPermiso,
  INFO_RECURSOS,
  obtenerCaminoAjustes,
  RecursoPermiso,
} from '@/lib/permisos';

interface PropsExplicacionPermiso {
  recurso: RecursoPermiso;
  estado: EstadoPermiso;
  onContinuar: () => void;
  onAbrirAjustes: () => void;
  children?: React.ReactNode;
}

export default function ExplicacionPermiso({
  recurso,
  estado,
  onContinuar,
  onAbrirAjustes,
  children,
}: PropsExplicacionPermiso) {
  const info = INFO_RECURSOS[recurso];
  const estaBloqueado = estado === 'bloqueado';
  const caminoPlataforma = obtenerCaminoAjustes(recurso);
  const nombrePlataforma = Platform.OS === 'ios' ? 'iOS' : 'Android';

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          Permiso requerido: {info.titulo} ({nombrePlataforma})
        </Text>
      </View>

      <Text style={styles.titulo}>{info.titulo}</Text>
      <Text style={styles.beneficio}>{info.beneficio}</Text>

      {estaBloqueado ? (
        <View style={styles.cajaBloqueo}>
          <Text style={styles.tituloBloqueo}>
            El permiso se encuentra bloqueado ({nombrePlataforma})
          </Text>
          <Text style={styles.textoBloqueo}>
            El sistema operativo ya no muestra el diálogo automático porque fue rechazado anteriormente. Para habilitarlo manualmente en {nombrePlataforma}, seguí este camino:
          </Text>
          <Text style={styles.camino}>{caminoPlataforma}</Text>
        </View>
      ) : (
        <Text style={styles.aclaracion}>
          Podés cambiar esta decisión en cualquier momento desde los Ajustes del sistema. Si preferís no dar el permiso, igual vas a poder cargar el reporte usando la alternativa manual.
        </Text>
      )}

      <Pressable
        style={[
          styles.botonPrincipal,
          estaBloqueado ? styles.botonAjustes : styles.botonContinuar,
        ]}
        onPress={estaBloqueado ? onAbrirAjustes : onContinuar}
      >
        <Text style={styles.textoBotonPrincipal}>
          {estaBloqueado ? 'Abrir Ajustes' : 'Continuar'}
        </Text>
      </Pressable>

      {children ? <View style={styles.alternativaContainer}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '600',
  },
  titulo: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  beneficio: {
    fontSize: 15,
    lineHeight: 22,
    color: '#1E293B',
    marginBottom: 12,
  },
  aclaracion: {
    fontSize: 13,
    lineHeight: 19,
    color: '#475569',
    marginBottom: 18,
  },
  cajaBloqueo: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 18,
  },
  tituloBloqueo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 6,
  },
  textoBloqueo: {
    fontSize: 13,
    lineHeight: 18,
    color: '#7F1D1D',
    marginBottom: 8,
  },
  camino: {
    fontSize: 13,
    fontWeight: '700',
    color: '#991B1B',
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 6,
  },
  botonPrincipal: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonContinuar: {
    backgroundColor: '#1D4ED8',
  },
  botonAjustes: {
    backgroundColor: '#B45309',
  },
  textoBotonPrincipal: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  alternativaContainer: {
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
});
