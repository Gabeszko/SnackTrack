import { useState, useEffect } from "react";
import { Home, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`w-full bg-blue-600 text-white flex items-center justify-between px-4 py-2 ${
        isSticky ? "sticky top-0 z-50 shadow-md" : ""
      }`}
    >
      <div className="font-bold text-xl">SnackTrack</div>

      <button
        onClick={() => {
          navigate("/");
        }}
        className="flex items-center gap-2 bg-blue-500 px-4 py-1.5 rounded hover:bg-blue-400 transition-colors"
      >
        <Home size={20} />
        Dashboard
      </button>

      <div className="flex items-center gap-2">
        <User size={20} />
        Üdv Felhasználó
      </div>
    </div>
  );
}
