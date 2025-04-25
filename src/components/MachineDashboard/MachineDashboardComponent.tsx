//import { useEffect, useState } from 'react';
//import axios from 'axios';
import NewMachineForm from "./NewMachineFormComponent";
import MachineList from "./MachineListComponent";
import { useState } from "react";
import { MachineType } from "../types";

function MachineDashboard() {
  const [machines, setMachines] = useState<MachineType[]>([]);

  return (
    <div style={{ padding: "2rem" }}>
      <NewMachineForm setMachines={setMachines} />
      <MachineList setMachines={setMachines} machines={machines} />
    </div>
  );
}

export default MachineDashboard;
