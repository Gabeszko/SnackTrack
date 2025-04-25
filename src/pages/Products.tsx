import ProductComponent from "../components/ProductDashboard/ProductComponent";

const Pricing: React.FC = () => {
  return (
    <div className="bg-blue-400/20 p-6">
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-2xl font-semibold text-primary-400 ">Árkezelés</h2>
        <p className="mt-2 text-gray-700">
          Itt kezelheted a termékek árait, akciókat állíthatsz be, vagy
          frissítheted az árlistát.
        </p>

        <ProductComponent></ProductComponent>
      </div>
    </div>
  );
};

export default Pricing;
