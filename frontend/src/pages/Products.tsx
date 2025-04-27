import { Center, Title } from "@mantine/core";
import ProductComponent from "../components/ProductDashboard/ProductComponent";

const Pricing: React.FC = () => {
  return (
    <div className="bg-blue-400/20 px-15 pb-10">
      <div className="bg-white rounded-lg p-4">
        <Center>
          <Title order={2} c="blue">
            Termékek
          </Title>
        </Center>
        <ProductComponent />
      </div>
    </div>
  );
};

export default Pricing;
