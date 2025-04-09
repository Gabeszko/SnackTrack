import { Link } from 'react-router-dom'

/*type NavbarProps = {
  username: string
}

const Navbar: React.FC<NavbarProps> = ({ username }) => {
  return (
    <nav>
      <p>Hello, {username}!</p>
    </nav>
  )
}*/ 

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary-500 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold">Automata Admin</h1>
      <div className="space-x-4">

        <Link to="/" className="hover:underline gap-2">Home</Link>
        <Link to="/inventory" className="hover:underline">Készlet</Link>
        <Link to="/pricing" className="hover:underline">Árak</Link>
        <Link to="/stats" className="hover:underline">Statisztika</Link>

      </div>
    </nav>
  )
}

export default Navbar