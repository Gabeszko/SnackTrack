import { useEffect, useState } from 'react';
import axios from 'axios';
//import Product from './ProductComponent.tsx'

// TODO: Product handling

export interface Slot {
  slotNumber: number;
  product: string; // vagy Product, ha populate-olva van
  quantity: number;
}

export interface Machine {
  _id?: string;
  name: string;
  location: string;
  slots: Slot[];
}

function Machine() {
  const [machines, setMachines] = useState<Machine[]>([]);

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    const res = await axios.get<Machine[]>('http://localhost:5000/api/machines');
    setMachines(res.data);
  };

  return (
    <div style={{ padding: '2rem' }}>  

    <h2>Automaták</h2>
    <ul>
      {machines.map((machine) => (
        <li key={machine._id}>
          <strong>{machine.name}</strong> – {machine.location}
          <ul>
            {machine.slots.map((slot, i) => (
              <li key={i}>
                Rekesz {slot.slotNumber}: {typeof /*slot.product ===  'object' ? slot.product.name :*/ slot.product} ({slot.quantity} db)
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>

    </div>
    );
  }
    
export default Machine;