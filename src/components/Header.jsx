import { PiHouseSimple } from "react-icons/pi";
import { PiPlusCircle } from "react-icons/pi";
import { PiUserLight } from "react-icons/pi";

function Header() {

  return (
    <header className="bg-BGcolor">
      <nav className="flex flex-row w-full px-10 h-16 justify-between items-center px-4 text-2xl">
        <PiHouseSimple className="hover:scale-110 transition duration-150" />
        <PiPlusCircle className="hover:scale-110 transition duration-150" />
        <PiUserLight className="hover:scale-110 transition duration-150" />
      </nav>
    </header>
  )
}

export default Header