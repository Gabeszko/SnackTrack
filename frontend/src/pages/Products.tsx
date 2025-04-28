import { Center, Title } from "@mantine/core";
import ProductDashboard from "../components/ProductDashboard/ProductDashboard";

const Pricing: React.FC = () => {
  return (
    <div className="bg-blue-400/20 px-15 pb-10">
      <div className="bg-white rounded-lg p-4">
        <Center>
          <Title order={2} c="blue">
            Termékek
          </Title>
        </Center>
        <ProductDashboard />
      </div>
    </div>
  );
};

export default Pricing;
