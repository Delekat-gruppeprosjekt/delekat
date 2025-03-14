import { PiHouseSimple } from "react-icons/pi";
import { PiPlusCircle } from "react-icons/pi";

function Header() {

  return (
    <header className="bg-BGcolor">
      <nav className="flex flex-row w-full h-16 justify-between items-center px-4">
        <PiHouseSimple />
        <PiPlusCircle />
        <h1 className="text-lg">Profile</h1>
      </nav>
    </header>
  )
}

export default Header