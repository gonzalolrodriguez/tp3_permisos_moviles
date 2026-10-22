import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CategoriaReporte, useReportes } from '@/lib/reportesStore';

const CATEGORIAS: { valor: CategoriaReporte; etiqueta: string }[] = [
  { valor: 'electricidad', etiqueta: 'Electricidad' },
  { valor: 'agua', etiqueta: 'Agua' },
  { valor: 'mobiliario', etiqueta: 'Mobiliario' },
  { valor: 'equipos', etiqueta: 'Equipos' },
];

export default function NuevoReporteScreen() {
  const router = useRouter();
  const { borrador, actualizarBorrador, crearReporte, limpiarBorrador } =
    useReportes();
  const [mensajeError, setMensajeError] = useState<string | null>(null);

  const guardar = () => {
    if (!borrador.titulo.trim()) {
      setMensajeError('Ingresá un título breve para identificar el desperfecto.');
      return;
    }
    if (!borrador.aula.trim()) {
      setMensajeError(
        'Completá el campo aula (podés escanear el QR de la puerta o escribirlo a mano).'
      );
      return;
    }

    setMensajeError(null);
    const creado = crearReporte();
    router.replace(`/reporte/${creado.id}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avisoContexto}>
        <Text style={styles.avisoContextoTexto}>
          Esta pantalla no pide ningún permiso al abrirse. Cada permiso se solicita recién cuando tocás su función específica, y todas tienen alternativa manual.
        </Text>
      </View>

      {mensajeError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTexto}>{mensajeError}</Text>
        </View>
      ) : null}

      <Text style={styles.label}>Título del desperfecto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Proyector no enciende o tubo quemado"
        value={borrador.titulo}
        onChangeText={(texto) => actualizarBorrador({ titulo: texto })}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.categoriasRow}>
        {CATEGORIAS.map((cat) => {
          const activa = borrador.categoria === cat.valor;
          return (
            <Pressable
              key={cat.valor}
              style={[
                styles.chipCategoria,
                activa ? styles.chipCategoriaActiva : null,
              ]}
              onPress={() => actualizarBorrador({ categoria: cat.valor })}
            >
              <Text
                style={[
                  styles.chipTexto,
                  activa ? styles.chipTextoActivo : null,
                ]}
              >
                {cat.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.label}>Aula (QR o ingreso manual)</Text>
      <View style={styles.filaAula}>
        <TextInput
          style={[styles.input, styles.inputAula]}
          placeholder="Ej: Aula 104 - Laboratorio"
          value={borrador.aula}
          onChangeText={(texto) => actualizarBorrador({ aula: texto })}
        />
        <Pressable
          style={styles.botonFuncion}
          onPress={() => router.push('/reporte/escanear')}
        >
          <Text style={styles.textoBotonFuncion}>Escanear QR</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Describí qué ocurre para orientar al personal de mantenimiento..."
        multiline
        numberOfLines={3}
        value={borrador.descripcion}
        onChangeText={(texto) => actualizarBorrador({ descripcion: texto })}
      />

      <View style={styles.bloqueAdjunto}>
        <View style={styles.bloqueHeader}>
          <Text style={styles.labelBloque}>Foto del desperfecto</Text>
          <Pressable
            style={styles.botonSecundario}
            onPress={() => router.push('/reporte/foto')}
          >
            <Text style={styles.textoBotonSecundario}>
              {borrador.fotoUri ? 'Cambiar foto' : 'Adjuntar foto'}
            </Text>
          </Pressable>
        </View>
        {borrador.fotoUri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri: borrador.fotoUri }} style={styles.previewImagen} />
            <Text style={styles.estadoAdjunto}>Foto adjuntada correctamente.</Text>
          </View>
        ) : (
          <Text style={styles.estadoVacio}>
            Sin foto adjunta (podés sacarla con la cámara o elegirla del selector sin permiso).
          </Text>
        )}
      </View>

      <View style={styles.bloqueAdjunto}>
        <View style={styles.bloqueHeader}>
          <Text style={styles.labelBloque}>Ubicación o sector en el edificio</Text>
          <Pressable
            style={styles.botonSecundario}
            onPress={() => router.push('/reporte/ubicacion')}
          >
            <Text style={styles.textoBotonSecundario}>
              {borrador.ubicacion ? 'Cambiar ubicación' : 'Marcar ubicación'}
            </Text>
          </Pressable>
        </View>
        {borrador.ubicacion ? (
          <Text style={styles.estadoAdjunto}>
            {borrador.ubicacion.detalleTexto}
          </Text>
        ) : (
          <Text style={styles.estadoVacio}>
            Sin ubicación marcada (podés usar ubicación actual en primer plano o elegir el sector a mano).
          </Text>
        )}
      </View>

      <View style={styles.botonesFinales}>
        <Pressable style={styles.botonGuardar} onPress={guardar}>
          <Text style={styles.textoBotonGuardar}>Guardar reporte</Text>
        </Pressable>
        <Pressable style={styles.botonLimpiar} onPress={limpiarBorrador}>
          <Text style={styles.textoBotonLimpiar}>Limpiar formulario</Text>
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
    paddingBottom: 36,
  },
  avisoContexto: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  avisoContextoTexto: {
    fontSize: 12,
    lineHeight: 18,
    color: '#1E40AF',
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  errorTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#991B1B',
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 14,
  },
  filaAula: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  inputAula: {
    flex: 1,
    marginBottom: 0,
  },
  botonFuncion: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 8,
  },
  textoBotonFuncion: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoriasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chipCategoria: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  chipCategoriaActiva: {
    backgroundColor: '#1D4ED8',
  },
  chipTexto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextoActivo: {
    color: '#FFFFFF',
  },
  bloqueAdjunto: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 14,
  },
  bloqueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelBloque: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  botonSecundario: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  textoBotonSecundario: {
    color: '#1E40AF',
    fontSize: 12,
    fontWeight: '700',
  },
  previewContainer: {
    marginTop: 4,
  },
  previewImagen: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#E2E8F0',
  },
  estadoAdjunto: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
  },
  estadoVacio: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  botonesFinales: {
    marginTop: 8,
    gap: 10,
  },
  botonGuardar: {
    backgroundColor: '#15803D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonGuardar: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  botonLimpiar: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotonLimpiar: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '600',
  },
});
