import { Link } from "react-router-dom";
import { BsGraphDown ,BsCashCoin } from "react-icons/bs";

export default function SideBar(){
    return(

        <aside className="w-64 h-full bg-accent text-white hidden md:flex flex-col shadow-lg">
            <Link to="/" className="flex items-center gap-3 p-4 text-lg hover:bg-primary hover:text-accent transition">
                <BsGraphDown className="text-2xl" />
                Dashboard
            </Link>
            <Link to="/expenses" className="flex items-center gap-3 p-4 text-lg hover:bg-primary hover:text-accent transition">
                <BsCashCoin className="text-2xl" />
                Expenses
            </Link>
        </aside>

    )
}