import { Link } from "react-router-dom";
import { BsGraphDown ,BsCashCoin,BsTable  } from "react-icons/bs";
import { MdOutlineWorkHistory } from "react-icons/md";
import { FaChartGantt } from "react-icons/fa6";

export default function SideBar(){
    return(

        <aside className="w-64 h-full bg-accent text-white hidden md:flex flex-col shadow-lg">
            <Link to="/" className="flex items-center gap-3 p-4 text-lg hover:bg-primary hover:text-accent transition">
                <BsGraphDown className="text-2xl" />
                Dashboard
            </Link>
            <Link to="/schedules" className="flex items-center gap-3 p-4 text-lg hover:bg-primary hover:text-accent transition">
                <BsTable  className="text-2xl" />
                Schedules
            </Link>
            <Link to="/expenses" className="flex items-center gap-3 p-4 text-lg hover:bg-primary hover:text-accent transition">
                <BsCashCoin className="text-2xl" />
                Expenses
            </Link>
            <Link to="/history" className="flex items-center gap-3 p-4 text-lg hover:bg-primary hover:text-accent transition">
                <MdOutlineWorkHistory className="text-2xl" />
                History
            </Link>
            <Link to="/summery" className="flex items-center gap-3 p-4 text-lg hover:bg-primary hover:text-accent transition">
                <FaChartGantt className="text-2xl" />
                Summery
            </Link>
            
        </aside>

    )
}