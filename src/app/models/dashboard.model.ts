/**
 * Modelo para las estadísticas del dashboard
 */
export interface DashboardStats {
  /** Número total de habitaciones */
  totalRooms: number;
  /** Número de habitaciones ocupadas */
  occupiedRooms: number;
  /** Número de habitaciones disponibles */
  availableRooms: number;
  /** Número de habitaciones en mantenimiento */
  maintenanceRooms: number;
  /** Número de check-ins programados para hoy */
  todayCheckIns: number;
  /** Número de check-outs programados para hoy */
  todayCheckOuts: number;
  /** Ingresos totales del mes actual en la moneda local */
  monthlyRevenue: number;
  /** Tasa de ocupación actual (porcentaje) */
  occupancyRate: number;
}
