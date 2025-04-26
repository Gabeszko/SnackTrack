import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
//import { MachineType } from "./types";

interface MachineType {
  id: number;
  name: string;
  location: [number, number]; // [latitude, longitude]
  status: "Active" | "Maintenance" | "Offline";
}

interface VendingMachineMapProps {
  machines?: MachineType[];
  center?: [number, number];
  zoom?: number;
}

// Fix Leaflet icon issue in React
// This is needed because webpack handles assets differently than a standard HTML file
const fixLeafletIcon = () => {
  delete (L.Icon.Default.prototype as any)._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  });
};

// User location control component
const LocationButton: React.FC = () => {
  const map = useMap();

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <div
      className="leaflet-control leaflet-bar"
      style={{ position: "absolute", top: "20px", right: "20px", zIndex: 1000 }}
    >
      <button
        onClick={handleClick}
        style={{
          width: "30px",
          height: "30px",
          background: "white",
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        📍
      </button>
    </div>
  );
};

// Main map component
const VendingMachineMap: React.FC<VendingMachineMapProps> = ({
  machines = [],
  center = [37.7749, -122.4194], // Default to San Francisco
  zoom = 13,
}) => {
  const [sampleMachines, setSampleMachines] = useState<MachineType[]>([]);

  // Initialize with sample data if no machines are provided
  useEffect(() => {
    fixLeafletIcon();

    if (machines.length === 0) {
      setSampleMachines([
        {
          id: 1,
          name: "VM-001",
          location: [37.7749, -122.4194],
          status: "Active",
        },
        {
          id: 2,
          name: "VM-002",
          location: [37.7695, -122.4143],
          status: "Active",
        },
        {
          id: 3,
          name: "VM-003",
          location: [37.784, -122.4076],
          status: "Maintenance",
        },
        {
          id: 4,
          name: "VM-004",
          location: [37.7699, -122.436],
          status: "Active",
        },
      ]);
    }
  }, [machines]);

  // Use provided machines if available, otherwise use sample data
  const displayMachines = machines.length > 0 ? machines : sampleMachines;

  // Create custom marker icon based on machine status
  const getMarkerIcon = (status: string) => {
    return new L.Icon({
      iconUrl:
        status === "Active"
          ? "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png"
          : "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      shadowSize: [41, 41],
    });
  };

  // Function to handle service request
  const handleServiceRequest = (machineId: number, machineName: string) => {
    // In a real app, you would make an API call here
    alert(`Service request sent for ${machineName}`);
  };

  return (
    <div className="vending-machine-map">
      <div
        className="header"
        style={{
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "10px 20px",
          textAlign: "center",
        }}
      >
        <h1>Vending Machine Locations</h1>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "600px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
          maxZoom={19}
        />

        {displayMachines.map((machine) => (
          <Marker
            key={machine.id}
            position={machine.location}
            icon={getMarkerIcon(/*machine.status*/ "Active")}
          >
            <Popup>
              <div className="info-box">
                <h3>{machine.name}</h3>
                <p>
                  <strong>Status:</strong> {/*machine.status*/ "nincsen"}
                </p>
                <button
                  onClick={() => handleServiceRequest(machine.id, machine.name)}
                >
                  Request Service
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        <LocationButton />
      </MapContainer>
    </div>
  );
};

export default VendingMachineMap;
