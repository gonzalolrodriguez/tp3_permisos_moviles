import React, { createContext, useCallback, useContext, useState } from 'react';

import { programarNotificacionResolucion } from '@/lib/permisos';

export type CategoriaReporte = 'electricidad' | 'agua' | 'mobiliario' | 'equipos';
export type SectorEdificio = 'patio' | 'estacionamiento' | 'pasillo';
export type EstadoReporte = 'pendiente' | 'en curso' | 'resuelto';

export interface UbicacionReporte {
  sector: SectorEdificio;
  origen: 'gps' | 'manual';
  aproximada: boolean;
  detalleTexto: string;
}

export interface Reporte {
  id: string;
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  estado: EstadoReporte;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
  fechaCreacion: string;
}

export interface AvisoInterno {
  id: string;
  reporteId: string;
  titulo: string;
  mensaje: string;
  fecha: string;
  leido: boolean;
}

export interface BorradorReporte {
  titulo: string;
  descripcion: string;
  aula: string;
  categoria: CategoriaReporte;
  fotoUri: string | null;
  ubicacion: UbicacionReporte | null;
}

const BORRADOR_INICIAL: BorradorReporte = {
  titulo: '',
  descripcion: '',
  aula: '',
  categoria: 'electricidad',
  fotoUri: null,
  ubicacion: null,
};

const REPORTES_INICIALES: Reporte[] = [
  {
    id: 'rep-101',
    titulo: 'Tubo fluorescente parpadea',
    descripcion: 'El segundo tubo sobre el pizarrón no termina de encender y hace ruido.',
    aula: 'Aula 104 - Laboratorio de Software',
    categoria: 'electricidad',
    estado: 'pendiente',
    fotoUri: null,
    ubicacion: {
      sector: 'pasillo',
      origen: 'manual',
      aproximada: false,
      detalleTexto: 'Sector elegido a mano: Pasillo',
    },
    fechaCreacion: '16/10/2026 18:40',
  },
  {
    id: 'rep-102',
    titulo: 'Canilla del bebedero pierde agua',
    descripcion: 'Queda goteando aunque se cierre del todo la llave de paso.',
    aula: 'Sector PB - Comedor',
    categoria: 'agua',
    estado: 'en curso',
    fotoUri: null,
    ubicacion: {
      sector: 'patio',
      origen: 'gps',
      aproximada: true,
      detalleTexto: 'Ubicación aproximada (Sector: Patio)',
    },
    fechaCreacion: '17/10/2026 09:15',
  },
  {
    id: 'rep-103',
    titulo: 'Proyector sin cable HDMI',
    descripcion: 'El conector de la mesa docente tiene los pines doblados.',
    aula: 'Aula 201 - Multimedia',
    categoria: 'equipos',
    estado: 'resuelto',
    fotoUri: null,
    ubicacion: {
      sector: 'pasillo',
      origen: 'manual',
      aproximada: false,
      detalleTexto: 'Sector elegido a mano: Pasillo',
    },
    fechaCreacion: '15/10/2026 14:20',
  },
];

const AVISOS_INICIALES: AvisoInterno[] = [
  {
    id: 'av-1',
    reporteId: 'rep-103',
    titulo: 'Reporte resuelto: Proyector sin cable HDMI',
    mensaje:
      'El equipo técnico reemplazó el cable HDMI en Aula 201 - Multimedia. El equipo ya quedó operativo.',
    fecha: '16/10/2026 11:00',
    leido: false,
  },
];

interface ContextoReportes {
  reportes: Reporte[];
  borrador: BorradorReporte;
  avisos: AvisoInterno[];
  avisarmeAlResolver: boolean;
  setAvisarmeAlResolver: (valor: boolean) => void;
  actualizarBorrador: (cambios: Partial<BorradorReporte>) => void;
  limpiarBorrador: () => void;
  crearReporte: () => Reporte;
  obtenerReportePorId: (id: string) => Reporte | undefined;
  simularResolucion: (id: string) => Promise<{
    notificacionProgramada: boolean;
    avisoAgregado: boolean;
  }>;
  marcarAvisoLeido: (id: string) => void;
}

const ReportesContext = createContext<ContextoReportes | null>(null);

function obtenerFechaHoraActual(): string {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const anio = ahora.getFullYear();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

export function ReportesProvider({ children }: { children: React.ReactNode }) {
  const [reportes, setReportes] = useState<Reporte[]>(REPORTES_INICIALES);
  const [borrador, setBorrador] = useState<BorradorReporte>(BORRADOR_INICIAL);
  const [avisos, setAvisos] = useState<AvisoInterno[]>(AVISOS_INICIALES);
  const [avisarmeAlResolver, setAvisarmeAlResolver] = useState<boolean>(false);

  const actualizarBorrador = useCallback((cambios: Partial<BorradorReporte>) => {
    setBorrador((prev) => ({ ...prev, ...cambios }));
  }, []);

  const limpiarBorrador = useCallback(() => {
    setBorrador(BORRADOR_INICIAL);
  }, []);

  const crearReporte = useCallback((): Reporte => {
    const nuevo: Reporte = {
      id: `rep-${Date.now()}`,
      titulo: borrador.titulo.trim() || 'Desperfecto sin título',
      descripcion: borrador.descripcion.trim() || 'Sin descripción adicional.',
      aula: borrador.aula.trim() || 'Aula sin especificar',
      categoria: borrador.categoria,
      estado: 'pendiente',
      fotoUri: borrador.fotoUri,
      ubicacion: borrador.ubicacion,
      fechaCreacion: obtenerFechaHoraActual(),
    };

    setReportes((prev) => [nuevo, ...prev]);
    setBorrador(BORRADOR_INICIAL);
    return nuevo;
  }, [borrador]);

  const obtenerReportePorId = useCallback(
    (id: string) => reportes.find((item) => item.id === id),
    [reportes]
  );

  const simularResolucion = useCallback(
    async (id: string) => {
      const encontrado = reportes.find((item) => item.id === id);
      if (!encontrado) {
        return { notificacionProgramada: false, avisoAgregado: false };
      }

      setReportes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, estado: 'resuelto' } : item))
      );

      // Si el usuario activó el interruptor Y el permiso está concedido,
      // se programa una notificación local a los 10 segundos.
      // Si no, el aviso queda solo en la bandeja interna (/avisos).
      let notificacionProgramada = false;
      if (avisarmeAlResolver) {
        notificacionProgramada = await programarNotificacionResolucion(
          encontrado.titulo,
          encontrado.aula
        );
      }

      if (notificacionProgramada) {
        return { notificacionProgramada: true, avisoAgregado: false };
      }

      const nuevoAviso: AvisoInterno = {
        id: `av-${Date.now()}`,
        reporteId: encontrado.id,
        titulo: `Reporte resuelto: ${encontrado.titulo}`,
        mensaje: `Mantenimiento marcó como resuelto el desperfecto en ${encontrado.aula}.`,
        fecha: obtenerFechaHoraActual(),
        leido: false,
      };

      setAvisos((prev) => [nuevoAviso, ...prev]);

      return { notificacionProgramada: false, avisoAgregado: true };
    },
    [reportes, avisarmeAlResolver]
  );

  const marcarAvisoLeido = useCallback((id: string) => {
    setAvisos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, leido: true } : item))
    );
  }, []);

  return (
    <ReportesContext.Provider
      value={{
        reportes,
        borrador,
        avisos,
        avisarmeAlResolver,
        setAvisarmeAlResolver,
        actualizarBorrador,
        limpiarBorrador,
        crearReporte,
        obtenerReportePorId,
        simularResolucion,
        marcarAvisoLeido,
      }}
    >
      {children}
    </ReportesContext.Provider>
  );
}

export function useReportes(): ContextoReportes {
  const ctx = useContext(ReportesContext);
  if (!ctx) {
    throw new Error('useReportes debe usarse dentro de ReportesProvider');
  }
  return ctx;
}
