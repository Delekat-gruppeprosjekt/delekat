import { Link, useLocation } from 'react-router'
import { PiHouseSimple } from "react-icons/pi";
import { PiPlusCircle } from "react-icons/pi";
import { PiUserLight } from "react-icons/pi";

function Header() {

  return (
    <header className="bg-navbar fixed bottom-0 w-full opacity-90">
      <nav className="flex flex-row w-full px-10 h-16 justify-between items-center px-4 text-2xl">
        <Link to="/"><PiHouseSimple className="hover:scale-110 transition duration-150" /></Link>
        <Link to="/create"><PiPlusCircle className="hover:scale-110 transition duration-150" /></Link>
        <Link to="/profile"><PiUserLight className="hover:scale-110 transition duration-150" /></Link>
      </nav>
    </header>
  )
}

export default Header