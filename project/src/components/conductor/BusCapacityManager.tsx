import { useState, useEffect } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Bus {
  id: string;
  bus_number: string;
  capacity_status: 'free' | 'moderate' | 'full';
  route_id: string;
  routes?: {
    route_number: string;
    route_name: string;
  }[];
  last_updated?: string;
}

export function BusCapacityManager() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    if (profile?.id) fetchConductorBuses();
  }, [profile?.id]);

  const fetchConductorBuses = async () => {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select(`
          id,
          bus_number,
          capacity_status,
          route_id,
          last_updated,
          routes (
            route_number,
            route_name
          )
        `)
        .eq('conductor_id', profile!.id);

      if (error) throw error;
      setBuses(data ?? []);
    } catch (err) {
      console.error('Error fetching buses:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateCapacityStatus = async (
    busId: string,
    newStatus: 'free' | 'moderate' | 'full'
  ) => {
    try {
      const { error } = await supabase
        .from('buses')
        .update({
          capacity_status: newStatus,
          last_updated: new Date().toISOString(),
        })
        .eq('id', busId);

      if (error) throw error;
      fetchConductorBuses();
    } catch {
      alert('Failed to update capacity status');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <p className="text-gray-600">Loading buses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Activity className="w-6 h-6 mr-2 text-green-600" />
          Bus Capacity Management
        </h2>
      </div>

      {buses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          No buses assigned to you.
        </div>
      ) : (
        buses.map((bus) => (
          <div key={bus.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{bus.bus_number}</h3>
                {bus.routes?.[0] && (
                  <p className="text-sm text-gray-600">
                    {bus.routes[0].route_number} – {bus.routes[0].route_name}
                  </p>
                )}
              </div>

              <span className="capitalize font-medium">
                {bus.capacity_status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {(['free', 'moderate', 'full'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => updateCapacityStatus(bus.id, status)}
                  className={`py-2 rounded-lg ${
                    bus.capacity_status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              Last updated:{' '}
              {bus.last_updated
                ? new Date(bus.last_updated).toLocaleString()
                : '—'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
