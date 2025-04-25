import MachineComponent from "../components/MachineDashboard/MachineDashboardComponent";

const Machines: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary-400">
        Készletkezelés
      </h2>
      <p className="mt-2 text-gray-700">
        Itt tudod nyilvántartani az automaták készletét, hozzáadni vagy
        szerkeszteni a termékeket.
      </p>

      <MachineComponent />
    </div>
  );
};

export default Machines;
