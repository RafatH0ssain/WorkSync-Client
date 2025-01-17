import { useContext } from 'react';
import { AuthContext } from '../Auth/AuthProvider';
import logoSvg from '../../assets/svg_logo_docFileImage.svg';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logOut, loading, userDetails } = useContext(AuthContext);

    return (
        <div className="navbar bg-base-100 poppins-semibold">
            <div className="flex-1">
                <img src={logoSvg} alt="website logo" className='w-7 sm:w-10 h-7 sm:h-10' />
                <Link className="text-2xl sm:text-4xl pl-2 font-extrabold text-orange-600 hover:text-orange-700 transition-all duration-300" to='/'>WorkSync</Link>
            </div>
            {/* Conditionally render second div only when the user is logged in */}
            {user && (
                <div className="flex-none">
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-15 rounded-full overflow-hidden transition-transform duration-250 hover:scale-110 hover:brightness-90">
                                {/* Fallback image handling */}
                                <img
                                    alt={user.displayName}
                                    src={user.photoURL || 'https://via.placeholder.com/150'}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/150'} // Fallback if image fails to load
                                />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between transition-transform duration-50 hover:scale-110">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li>
                                <Link to="/work-sheet" className="transition-transform duration-300 delay-100 hover:scale-110">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <a className="transition-transform duration-300 delay-100 hover:scale-110" onClick={logOut}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Navbar;