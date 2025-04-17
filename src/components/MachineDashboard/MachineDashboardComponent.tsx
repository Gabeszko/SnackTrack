//import { useEffect, useState } from 'react';
//import axios from 'axios';
import NewMachineForm from './NewMachineFormComponent';
import MachineList from './MachineListComponent';

function MachineDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <NewMachineForm></NewMachineForm>
      <MachineList></MachineList>
    </div>
  );
}
  
export default MachineDashboard;