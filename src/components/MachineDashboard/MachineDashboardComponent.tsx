import NewMachineForm from "./NewMachineFormComponent";
import MachineList from "./MachineListComponent";
import { useState } from "react";
import { MachineType } from "../types";
//import VendingMachineMap from "../VendingMachineMapComponent";

function MachineDashboard() {
  const [machines, setMachines] = useState<MachineType[]>([]);
  const [editingMachine, setEditingMachine] = useState<MachineType | null>(
    null
  );

  //        <VendingMachineMap />;

  return (
    <div style={{ padding: "2rem" }}>
      <div className="px-20">
        <NewMachineForm
          setMachines={setMachines}
          editingMachine={editingMachine} // Az éppen szerkesztett gép
          clearEditingMachine={() => setEditingMachine(null)} // Szerkeztés megszakítása
        />
      </div>
      <MachineList
        machines={machines}
        setMachines={setMachines}
        onEditMachine={(machine) => setEditingMachine(machine)} // Gépkiválasztás szerkesztésre
      />
    </div>
  );
}

export default MachineDashboard;
