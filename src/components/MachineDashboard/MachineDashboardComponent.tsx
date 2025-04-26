import NewMachineForm from "./NewMachineFormComponent";
import MachineList from "./MachineListComponent";
import { useState } from "react";
import { MachineType } from "../types";
import VendingMachineMap from "../VendingMachineMapComponent";

function MachineDashboard() {
  const [machines, setMachines] = useState<MachineType[]>([]);
  const [editingMachine, setEditingMachine] = useState<MachineType | null>(
    null
  );

  const mapMachines = machines.map((machine) => {
    const [lat, lng] = machine.location.split(",").map(Number);
    return {
      id: machine._id, // vagy csinálhatsz parseInt(machine._id) ha kell szám
      name: machine.name,
      location: [lat, lng] as [number, number],
      status: machine.status, // akár később felhasználhatjuk
    };
  });

  return (
    <div style={{ padding: "2rem" }}>
      <div className="px-20">
        <NewMachineForm
          setMachines={setMachines}
          editingMachine={editingMachine} // Az éppen szerkesztett gép
          clearEditingMachine={() => setEditingMachine(null)} // Szerkeztés megszakítása
        />
      </div>
      <VendingMachineMap
        machines={mapMachines}
        center={[47.4979, 19.0402]} // Magyarország/Budapest
        zoom={7}
      />
      <MachineList
        machines={machines}
        setMachines={setMachines}
        onEditMachine={(machine) => setEditingMachine(machine)} // Gépkiválasztás szerkesztésre
      />
    </div>
  );
}

export default MachineDashboard;
