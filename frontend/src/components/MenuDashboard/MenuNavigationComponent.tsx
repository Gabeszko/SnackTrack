import { IconBox, IconCash, IconChartBar } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Automaták",
    icon: <IconBox size={48} />,
    color: "blue",
    path: "/machines",
  },
  {
    title: "Termékek",
    icon: <IconCash size={48} />,
    color: "grape",
    path: "/products",
  },
  {
    title: "Statisztika",
    icon: <IconChartBar size={48} />,
    color: "cyan",
    path: "/statistics",
  },
];

export default function MenuNavigation() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 bg-white p-8 rounded-lg shadow-lg">
      {menuItems.map((item) => (
        <div
          key={item.title}
          onClick={() => {
            navigate(item.path);
          }}
          className="block"
        >
          <div className="shadow-md rounded-md p-10 h-[300px] text-center flex flex-col justify-center items-center cursor-pointer transition-all duration-200 hover:translate-y-[-5px] hover:shadow-xl">
            <div
              className={`h-20 w-20 rounded-full flex justify-center items-center mb-4 bg-${item.color}-100`}
            >
              {item.icon}
            </div>
            <h2 className="text-2xl font-bold">{item.title}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}
