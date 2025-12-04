// src/components/Navbar.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav>
            <div>
                <Link to="/"><strong>FestManager</strong></Link>
            </div>
            <div>
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (
                    <>
                        {user.role === 'attendee' && <Link to="/student">My Tickets</Link>}
                        {user.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
                        {user.role === 'volunteer' && <Link to="/scan">Scanner</Link>}
                        <a onClick={handleLogout}>Logout</a>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
