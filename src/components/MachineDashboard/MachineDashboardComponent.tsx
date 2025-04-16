//import { useEffect, useState } from 'react';
//import axios from 'axios';
//import SlotEditor/*, { Slot, Product }*/ from './SlotEditorComponent';
//import { Card, Group, Stack, Text, Title } from '@mantine/core';
import NewMachineForm from './NewMachineFormComponent';
import MachineList from './MachineListComponent';
//import { MachineType } from '../types'


function MachineDashboard() {
  return (
    <div style={{ padding: '2rem' }}>
      <NewMachineForm></NewMachineForm>
      <MachineList></MachineList>

    </div>
  );
}
  
export default MachineDashboard;