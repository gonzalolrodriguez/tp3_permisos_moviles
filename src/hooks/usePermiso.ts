import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { useRevisarAlVolver } from '@/hooks/useRevisarAlVolver';
import {
  abrirAjustesSistema,
  consultarPermisoRecurso,
  EstadoPermiso,
  RecursoPermiso,
  solicitarPermisoRecurso,
} from '@/lib/permisos';

export function usePermiso(recurso: RecursoPermiso) {
  const [estado, setEstado] = useState<EstadoPermiso>('cargando');
  const [parcial, setParcial] = useState<boolean>(false);
  const [matiz, setMatiz] = useState<string | null>(null);

  // Consulta el estado real al sistema operativo
  const consultar = useCallback(async () => {
    const res = await consultarPermisoRecurso(recurso);
    setEstado(res.estado);
    setParcial(res.parcial);
    setMatiz(res.matiz);
  }, [recurso]);

  // Pide el permiso (muestra el dialogo del sistema) y actualiza el estado
  const pedir = async () => {
    const res = await solicitarPermisoRecurso(recurso);
    setEstado(res.estado);
    setParcial(res.parcial);
    setMatiz(res.matiz);
    return res;
  };

  const abrirAjustes = async () => {
    await abrirAjustesSistema();
  };

  // Vuelve a consultar cada vez que la pantalla gana el foco
  useFocusEffect(
    useCallback(() => {
      consultar();
    }, [consultar])
  );

  // Y cuando la app vuelve de Ajustes (segundo plano -> activa)
  useRevisarAlVolver(consultar);

  return { estado, parcial, matiz, pedir, consultar, abrirAjustes };
}
