import ProductComponent from "../components/ProductDashboard/ProductComponent"

const Pricing: React.FC = () => {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-primary-400">Árkezelés</h2>
        <p className="mt-2 text-gray-700">
          Itt kezelheted a termékek árait, akciókat állíthatsz be, vagy frissítheted az árlistát.
        </p>

        <ProductComponent></ProductComponent>

      </div>
    )
  }
  
  export default Pricing
  