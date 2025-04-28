import MenuNavigation from "./MenuNavigationComponent";

const MenuDashboard: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-52.8px)] bg-blue-400/20 relative">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-6xl">
        <MenuNavigation />
      </div>
    </div>
  );
};

export default MenuDashboard;
