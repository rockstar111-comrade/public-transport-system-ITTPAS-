// src/api/transportApi.ts
import type { BusStop, Route, RouteWithDetails } from "../types/transport";

const BASE_URL = "http://localhost:5000";

export async function getBusStops(): Promise<BusStop[]> {
  const res = await fetch(`${BASE_URL}/stops`);
  return res.json();
}

export async function getRoutes(): Promise<Route[]> {
  const res = await fetch(`${BASE_URL}/routes`);
  return res.json();
}

export async function searchRoutes(from: string, to: string): Promise<Route[]> {
  const res = await fetch(`${BASE_URL}/search?from=${from}&to=${to}`);
  return res.json();
}

export async function getRouteDetails(routeId: string): Promise<RouteWithDetails> {
  const res = await fetch(`${BASE_URL}/route/${routeId}`);
  return res.json();
}
