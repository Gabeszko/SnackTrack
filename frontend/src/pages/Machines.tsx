import { Center, Title } from "@mantine/core";
import MachineComponent from "../components/MachineDashboard/MachineDashboardComponent";

const Machines: React.FC = () => {
  return (
    <div className="bg-blue-400/20 px-15 pb-10">
      <div className="bg-white rounded-lg p-4">
        <Center>
          <Title order={2} c="blue">
            Automaták
          </Title>
        </Center>
        <MachineComponent />
      </div>
    </div>
  );
};

export default Machines;
