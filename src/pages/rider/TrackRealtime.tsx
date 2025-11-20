
import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Fix Leaflet default icon issue for TypeScript
(delete (L.Icon.Default as any).prototype._getIconUrl);
(L.Icon.Default as any).mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png',
});

export default function TrackRealtime() {
  // Demo ride data
  const [ride] = useState({
    pickup: { lat: 23.8103, lng: 90.4125, address: 'Pickup: Dhaka, Bangladesh' },
    destination: { lat: 23.7806, lng: 90.2794, address: 'Destination: Mirpur, Dhaka' },
    driver: { lat: 23.8000, lng: 90.4000, name: 'Demo Driver', email: 'driver@example.com' },
    status: 'pending', // can be 'pending', 'accepted', 'picked_up', 'completed'
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Track Your Ride</h2>
          <p className="text-muted-foreground">
            View pickup, destination, and driver locations in real-time
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ride Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Status: <span className="font-semibold">{ride.status.replace('_', ' ')}</span>
            </p>
            {ride.status === 'pending' || ride.status === 'requested' ? (
              <p className="text-sm text-muted-foreground">
                You can cancel the ride while it is pending or requested.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ride Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] w-full">
              <MapContainer
                center={[ride.pickup.lat, ride.pickup.lng]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Pickup Marker */}
                <Marker position={[ride.pickup.lat, ride.pickup.lng]}>
                  <Popup>{ride.pickup.address}</Popup>
                </Marker>

                {/* Destination Marker */}
                <Marker position={[ride.destination.lat, ride.destination.lng]}>
                  <Popup>{ride.destination.address}</Popup>
                </Marker>

                {/* Driver Marker */}
                <Marker position={[ride.driver.lat, ride.driver.lng]}>
                  <Popup>
                    {ride.driver.name} <br /> {ride.driver.email}
                  </Popup>
                </Marker>

                {/* Route Polyline */}
                <Polyline
                  positions={[
                    [ride.pickup.lat, ride.pickup.lng],
                    [ride.destination.lat, ride.destination.lng],
                  ]}
                  color="blue"
                />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
