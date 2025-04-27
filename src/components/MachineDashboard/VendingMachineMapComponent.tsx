import React, { useEffect, useState, useRef } from "react";
import { COLORS } from "../types";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MachineType {
  id: string;
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

// Define custom marker icons for different machine statuses
const createStatusIcon = (status: string) => {
  // Set icon color based on status
  let iconColor = "#3b82f6"; // Default blue

  switch (status) {
    case "Active":
      iconColor = COLORS.success;
      break;
    case "Maintenance":
      iconColor = COLORS.warning;
      break;
    case "Offline":
      iconColor = COLORS.danger;
      break;
  }

  return L.divIcon({
    className: "custom-icon",
    html: `
      <div style="
        background-color: ${iconColor};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          opacity: 0.8;
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
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
      style={{
        position: "absolute",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleClick}
        style={{
          width: "40px",
          height: "40px",
          background: "white",
          border: "2px solid rgba(0,0,0,0.2)",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        }}
        title="Saját helyzet mutatása"
      >
        📍
      </button>
    </div>
  );
};

// Component to make sure map size is correct
const MapInitializer: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Ensure map has correct dimensions
    const resizeMap = () => {
      if (map) {
        map.invalidateSize();
      }
    };

    // Initial resize
    resizeMap();

    // Set up more resize attempts
    const timers = [
      setTimeout(resizeMap, 100),
      setTimeout(resizeMap, 500),
      setTimeout(resizeMap, 1000),
      setTimeout(resizeMap, 2000),
    ];

    // Handle window resize
    window.addEventListener("resize", resizeMap);

    // Cleanup
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      window.removeEventListener("resize", resizeMap);
    };
  }, [map]);

  return null;
};

// Main map component
const VendingMachineMap: React.FC<VendingMachineMapProps> = ({
  machines = [],
  center = [47.4979, 19.0402], // Default to Budapest
  zoom = 7,
}) => {
  const [sampleMachines, setSampleMachines] = useState<MachineType[]>([]);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize with sample data if no machines are provided
  useEffect(() => {
    fixLeafletIcon();

    if (machines.length === 0) {
      setSampleMachines([
        {
          id: "1",
          name: "Budapest-001",
          location: [47.4979, 19.0402],
          status: "Active",
        },
        {
          id: "2",
          name: "Debrecen-001",
          location: [47.5295, 21.6407],
          status: "Active",
        },
        {
          id: "3",
          name: "Szeged-001",
          location: [46.253, 20.1414],
          status: "Maintenance",
        },
        {
          id: "4",
          name: "Pécs-001",
          location: [46.0727, 18.2324],
          status: "Offline",
        },
      ]);
    }
  }, [machines]);

  // Make sure we have a stable container before rendering the map
  useEffect(() => {
    if (containerRef.current) {
      const checkSize = () => {
        const container = containerRef.current;
        if (
          container &&
          container.offsetWidth > 0 &&
          container.offsetHeight > 0
        ) {
          setIsMapReady(true);
        } else {
          setTimeout(checkSize, 100);
        }
      };

      checkSize();
    }
  }, []);

  // Use provided machines if available, otherwise use sample data
  const displayMachines = machines.length > 0 ? machines : sampleMachines;

  // Function to handle service request
  const handleServiceRequest = (machineId: string, machineName: string) => {
    // Stop event propagation to prevent map interactions
    event?.stopPropagation();

    // In a real app, you would make an API call here
    alert(`Szervizkérés elküldve a következő automatához: ${machineName}`);
  };

  // Function to get status name in Hungarian
  const getStatusName = (status: string) => {
    switch (status) {
      case "Active":
        return "Aktív";
      case "Maintenance":
        return "Karbantartás alatt";
      case "Offline":
        return "Offline";
      default:
        return status;
    }
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return COLORS.success;
      case "Maintenance":
        return COLORS.warning;
      case "Offline":
        return COLORS.danger;
      default:
        return COLORS.dark;
    }
  };

  // Only render the map if container is ready
  return (
    <div
      className="vending-machine-map"
      style={{ marginBottom: "2rem" }}
      ref={containerRef}
    >
      <div
        className="header"
        style={{
          backgroundColor: COLORS.primary,
          color: "white",
          padding: "15px 20px",
          borderRadius: "8px 8px 0 0",
          fontWeight: "bold",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ marginRight: "10px" }}>🗺️</span>
        Automaták elhelyezkedése
      </div>

      <div
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          position: "relative",
        }}
      >
        {isMapReady && (
          <MapContainer
            whenCreated={(map) => {
              mapRef.current = map;
            }}
            center={center}
            zoom={zoom}
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            attributionControl={false}
            zoomControl={true}
            doubleClickZoom={true}
            scrollWheelZoom={true}
            dragging={true}
            easeLinearity={0.35}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
              maxZoom={19}
            />

            <MapInitializer />

            {displayMachines
              .filter(
                (machine) =>
                  machine.location &&
                  Array.isArray(machine.location) &&
                  machine.location.length === 2
              )
              .map((machine) => (
                <Marker
                  key={machine.id}
                  position={machine.location}
                  icon={createStatusIcon(machine.status)}
                  eventHandlers={{
                    click: (e) => {
                      // Prevent default behavior if needed
                      L.DomEvent.stopPropagation(e);
                    },
                  }}
                >
                  <Popup>
                    <div
                      style={{
                        padding: "10px",
                        minWidth: "200px",
                      }}
                    >
                      <h3
                        style={{
                          borderBottom: `2px solid ${getStatusColor(
                            machine.status
                          )}`,
                          paddingBottom: "5px",
                          marginTop: 0,
                          color: COLORS.dark,
                        }}
                      >
                        {machine.name}
                      </h3>

                      <div style={{ marginBottom: "10px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5px",
                          }}
                        >
                          <strong style={{ marginRight: "10px" }}>
                            Állapot:
                          </strong>
                          <span
                            style={{
                              backgroundColor: getStatusColor(machine.status),
                              color: "white",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "bold",
                            }}
                          >
                            {getStatusName(machine.status)}
                          </span>
                        </div>

                        <div>
                          <strong>Koordináták:</strong>{" "}
                          {machine.location[0].toFixed(4)},{" "}
                          {machine.location[1].toFixed(4)}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleServiceRequest(machine.id, machine.name);
                        }}
                        style={{
                          backgroundColor: COLORS.primary,
                          color: "white",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "4px",
                          cursor: "pointer",
                          width: "100%",
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ marginRight: "5px" }}>🔧</span>
                        Szervizkérés
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}

            <LocationButton />
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default VendingMachineMap;
