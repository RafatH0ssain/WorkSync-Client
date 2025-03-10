import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import logoSvg from '../../assets/svg_logo_docFileImage.svg';
import { Link } from 'react-router-dom';
import { FaUserAstronaut } from 'react-icons/fa';

const Navbar = () => {
    const { user, logOut, loading, userDetails } = useContext(AuthContext);

    // Show minimal navbar during loading
    if (loading) {
        return <div className="navbar bg-white poppins-semibold pt-7">
            <div className="flex-1">
                <img src={logoSvg} alt="website logo" className='w-7 sm:w-10 h-7 sm:h-10' />
                <Link className="text-2xl sm:text-4xl pl-2 font-extrabold text-orange-600 hover:text-orange-700 transition-all duration-300" to='/'>WorkSync</Link>
            </div>
        </div>;
    }

    // Only check roles if userDetails exists
    const isEmployee = userDetails?.userType === "employee";
    const isHR = userDetails?.userType === "hr";
    const isAdmin = userDetails?.userType === "admin";

    return (
        <div className="navbar bg-white poppins-semibold pt-7">
            <div className="flex-1">
                <img src={logoSvg} alt="website logo" className='w-7 sm:w-10 h-7 sm:h-10' />
                <Link className="text-2xl sm:text-4xl pl-2 font-extrabold text-orange-600 hover:text-orange-700 transition-all duration-300" to='/'>WorkSync</Link>
            </div>

            {/* Only show menu if both user and userDetails exist */}
            {user && userDetails && (
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-15 rounded-full overflow-hidden transition-transform duration-250 hover:scale-110 hover:brightness-90">
                                {user.photoURL ? (
                                    <img
                                        alt={user.displayName || 'User'}
                                        src={user.photoURL}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            // Create and append FaUserAstronaut icon
                                            const iconContainer = e.target.parentElement;
                                            iconContainer.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-200"><FaUserAstronaut size={24} /></div>';
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-gray-200">
                                        <FaUserAstronaut size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            {/* Common Profile option */}
                            <li>
                                <Link to="/profile" className="justify-between transition-transform duration-50 hover:scale-110">
                                    Profile
                                    <span className="badge">New</span>
                                </Link>
                            </li>

                            {/* Conditional Links based on Role */}
                            {isEmployee && (
                                <li>
                                    <Link to="/work-sheet" className="transition-transform duration-300 delay-100 hover:scale-110">
                                        Dashboard
                                    </Link>
                                </li>
                            )}

                            {isHR && (
                                <>
                                    <li>
                                        <Link to="/employee-list" className="transition-transform duration-300 delay-100 hover:scale-110">
                                            Employee List
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/progress" className="transition-transform duration-300 delay-100 hover:scale-110">
                                            Work Progress
                                        </Link>
                                    </li>
                                </>
                            )}

                            {isAdmin && (
                                <>
                                    <li>
                                        <Link to="/all-employee-list" className="transition-transform duration-300 delay-100 hover:scale-110">
                                            All Employees
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/payroll" className="transition-transform duration-300 delay-100 hover:scale-110">
                                            Payroll
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li>
                                <button
                                    className="transition-transform duration-300 delay-100 hover:scale-110"
                                    onClick={logOut}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;