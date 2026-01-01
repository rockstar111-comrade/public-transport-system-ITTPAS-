// src/types/transport.ts

export interface BusStop {
  stop_id: string;
  stop_name: string;
  latitude: number;
  longitude: number;
}

export interface Route {
  route_id: string;
  route_number: string;
  route_name: string;
}

export interface RouteWithDetails extends Route {
  stops: BusStop[];
  shape: [number, number][];
}
