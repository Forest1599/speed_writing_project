import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons/faKeyboard';
import { faChartSimple, faUser, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {

    return (
        <nav className="p-7 navbar">
            <div className="flex justify-between items-center relative text-2xl">

                {/* Left: Logo */}
                <div className="flex text-2xl flex-shrink-0 navbar-btn">
                <Link to="/">
                    <FontAwesomeIcon icon={faQuoteLeft} />
                    <span className="text-xl"> Speed Writing App</span>
                </Link>
                </div>

                {/* Center: Buttons (only show on md+ screens) */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-5">
                <div>
                    <Link to="/">
                        <FontAwesomeIcon className="navbar-btn" icon={faKeyboard} />
                    </Link>
                </div>
                <div>
                    <Link to="/adaptive">
                        <FontAwesomeIcon className="navbar-btn" icon={faChartSimple} />
                    </Link>
                </div>
                </div>

                {/* Right: Profile and (Keyboard + Chart) for small screens */}
                <div className="flex items-center space-x-5">
                
                {/* Keyboard and Chart icons only on small screens */}
                <div className="flex md:hidden space-x-5">
                    <Link to="/">
                        <FontAwesomeIcon className="navbar-btn" icon={faKeyboard} />
                    </Link>
                    {/* <Link to={isLoggedIn ? "/adaptive" : "/login"}>
                        <FontAwesomeIcon className="navbar-btn" icon={faChartSimple} />
                    </Link> */}
                    <Link to="/adaptive">
                        <FontAwesomeIcon className="navbar-btn" icon={faChartSimple} />
                    </Link>
                </div>

                {/* Profile icon always visible */}
                <Link to="/profile">
                    <FontAwesomeIcon className="navbar-btn" icon={faUser} />
                </Link>
                </div>

            </div>
        </nav>
    )
}

export default Navbar;