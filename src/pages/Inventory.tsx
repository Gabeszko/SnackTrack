import MachineComponent from "../components/MachineDashboard/MachineDashboardComponent"

const Inventory: React.FC = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-primary-400">Készletkezelés</h2>
        <p className="mt-2 text-gray-700">
          Itt fogod tudni nyilvántartani az automaták készletét, hozzáadni vagy szerkeszteni a termékeket.
        </p>

        <MachineComponent></MachineComponent>

      </div>
    )
  }
  
  export default Inventory
  