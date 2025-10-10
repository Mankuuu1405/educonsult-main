import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, ChevronDown, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { gsap } from 'gsap';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthDropdownOpen, setIsAuthDropdownOpen] = useState(false);

    // --- NEW: State to hold user info ---
    const [userInfo, setUserInfo] = useState(null);

    const authDropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const navbarRef = useRef(null);
    const magicBgRef = useRef(null);
    const navLinksContainerRef = useRef(null);
    const activeLinkIndicatorRef = useRef(null);
    const navigate = useNavigate();

    // --- NEW: Effect to check localStorage on mount ---
    useEffect(() => {
        const facultyData = localStorage.getItem('facultyInfo');
        const studentData = localStorage.getItem('studentInfo');

        if (facultyData) {
            setUserInfo(JSON.parse(facultyData));
        } else if (studentData) {
            setUserInfo(JSON.parse(studentData));
        }
    }, []);

    // --- GSAP Animations ---
    useEffect(() => {
        gsap.to(navbarRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 });

        const handleMouseMove = (e) => {
            if (magicBgRef.current) {
                gsap.to(magicBgRef.current, { duration: 0.7, x: e.clientX, y: e.clientY, ease: 'power2.out' });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        const magneticElements = navbarRef.current.querySelectorAll('.magnetic');
        magneticElements.forEach((el) => {
            el.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const { left, top, width, height } = el.getBoundingClientRect();
                gsap.to(el, { x: (clientX - (left + width / 2)) * 0.2, y: (clientY - (top + height / 2)) * 0.4, duration: 0.8, ease: 'power3.out' });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.3)' });
            });
        });

        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        if (navLinksContainerRef.current) {
            const navLinks = navLinksContainerRef.current.querySelectorAll('a');
            const indicator = activeLinkIndicatorRef.current;

            const handleLinkHover = (e) => {
                const link = e.currentTarget;
                gsap.to(indicator, { width: link.offsetWidth, x: link.offsetLeft, duration: 0.4, ease: 'power3.inOut', opacity: 1 });
            };
            const handleLinkLeave = () => {
                gsap.to(indicator, { opacity: 0, duration: 0.3, ease: 'power3.inOut' });
            }

            navLinks.forEach(link => link.addEventListener('mouseenter', handleLinkHover));
            navLinksContainerRef.current.addEventListener('mouseleave', handleLinkLeave);

            return () => {
                navLinks.forEach(link => link.removeEventListener('mouseenter', handleLinkHover));
                if (navLinksContainerRef.current) navLinksContainerRef.current.removeEventListener('mouseleave', handleLinkLeave);
            }
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (authDropdownRef.current && !authDropdownRef.current.contains(event.target)) {
                setIsAuthDropdownOpen(false);
            }
            const mobileMenuButton = document.querySelector('.mobile-menu-button');
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMobileMenuOpen && mobileMenuButton && !mobileMenuButton.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    // --- NEW: Logout Handler ---
    const logoutHandler = () => {
        localStorage.removeItem('facultyInfo');
        localStorage.removeItem('studentInfo');
        setUserInfo(null);
        setIsAuthDropdownOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    // Reusable component for dropdown items that navigate
    const DropdownItem = ({ icon: Icon, text, path }) => (
        <Link to={path} onClick={() => setIsAuthDropdownOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm text-text-primary hover:bg-light-bg hover:text-primary transition-all duration-200 ease-in-out rounded-lg">
            {Icon && <Icon className="mr-3 h-4 w-4 text-text-secondary" />}
            <span className="font-medium">{text}</span>
        </Link>
    );

    // Reusable component for mobile navigation links
    const MobileNavLink = ({ href, children }) => (
        <Link to={href} onClick={() => setIsMobileMenuOpen(false)}
            className="block px-4 py-3 text-base font-semibold text-text-primary hover:bg-secondary hover:text-primary transition-colors duration-200 rounded-lg">
            {children}
        </Link>
    );

    // --- NEW: Component for the logged-in user view in dropdowns ---
  const AuthLinks = () => (
        <>
            {userInfo.role === 'admin' && (
                <DropdownItem icon={LayoutDashboard} text="Admin Dashboard" path="/admin-dashboard" />
            )}
            {userInfo.role === 'faculty' && (
                <DropdownItem icon={User} text="Faculty Dashboard" path="/faculty-dashboard" />
            )}
            {userInfo.role === 'student' && (
                <DropdownItem icon={User} text="Student Dashboard" path="/student-dashboard" />
            )}
            <div className="h-px bg-gray-200/80 my-2"></div>
            <button
                onClick={logoutHandler}
                className="flex items-center w-full px-4 py-2.5 text-sm text-text-primary hover:bg-light-bg hover:text-primary transition-all duration-200 ease-in-out rounded-lg"
            >
                <LogOut className="mr-3 h-4 w-4 text-text-secondary" />
                <span className="font-medium">Logout</span>
            </button>
        </>
    );

    const GuestLinks = () => (
        <>
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">For Students</div>
            <DropdownItem icon={LogIn} text="Student Login" path="/student/login" />
            <DropdownItem icon={UserPlus} text="Student Signup" path="/student/signup" />
            <div className="h-px bg-gray-200/80 my-2"></div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">For Mentors</div>
            <DropdownItem icon={LogIn} text="Mentor Login" path="/faculty/login" />
            <DropdownItem icon={UserPlus} text="Mentor Signup" path="/faculty/signup" />
        </>
    );

    return (

        <>
            <div ref={magicBgRef} className="fixed top-0 left-0 w-64 h-64 bg-accent/20 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 filter blur-xl opacity-50" />
            <nav ref={navbarRef} className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl mx-auto bg-white backdrop-blur-lg shadow-lg rounded-2xl z-50 border border-white opacity-0 -translate-y-16 font-sans">
                <div className="container mx-auto flex justify-between items-center p-2">
                    {/* --- Logo and Nav Links (No changes here) --- */}
                <Link to="/" className="flex items-center">
                        <img src="/logo.jpg" alt="CeTutor Logo" className="h-12 md:h-16 w-auto object-contain" />
                        <span className="ml-2 text-xl md:text-3xl font-bold text-primary tracking-tight font-serif"></span>
                    </Link>
                    <div ref={navLinksContainerRef} className="hidden md:flex relative space-x-2 lg:space-x-4 items-center bg-secondary p-1 rounded-full border border-primary">
                        <div ref={activeLinkIndicatorRef} className="absolute h-[80%] bg-white rounded-full top-1/2 -translate-y-1/2 shadow-sm pointer-events-none opacity-0" />
                        <a href="/" className="relative px-4 py-1.5 rounded-full text-sm font-semibold text-text-primary transition-colors hover:text-primary">Home</a>
                        <a href="/browse" className="relative px-4 py-1.5 rounded-full text-sm font-semibold text-text-primary transition-colors hover:text-primary">Listings</a>
                        <a href="/pricing" className="relative px-4 py-1.5 rounded-full text-sm font-semibold text-text-primary transition-colors hover:text-primary">Pricing</a>
                        <a href="/support" className="relative px-4 py-1.5 rounded-full text-sm font-semibold text-text-primary transition-colors hover:text-primary">Support</a>
                    </div>

                    <div className="flex items-center space-x-3">
                        {/* --- MODIFIED: Auth Dropdown --- */}
                        <div className="relative hidden md:block" ref={authDropdownRef}>
                            <button onClick={() => setIsAuthDropdownOpen(!isAuthDropdownOpen)}
                                className=" flex items-center space-x-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-full p-2.5 transition-all duration-300 bg-white/50 hover:bg-white/80 shadow-sm border border-transparent hover:border-white/20">
                                <User className="h-5 w-5 text-primary" />
                                <span className="text-sm font-semibold pr-1">{userInfo ? userInfo.fullName.split(' ')[0] : ''}</span>
                                <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform duration-300 ${isAuthDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`absolute right-0 mt-4 w-64 bg-white border border-gray-200/80 rounded-xl shadow-2xl p-2 origin-top-right transition-all duration-300 ease-in-out ${isAuthDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                {userInfo ? <AuthLinks /> : <GuestLinks />}
                            </div>
                        </div>
                        {/* Mobile Menu Button (No changes) */}
                        <div className="md:hidden">
                             <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                 className=" mobile-menu-button focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full p-2.5 transition-all duration-200 bg-white/50 hover:bg-white/80 shadow-sm">
                                 <div className={`transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? 'rotate-90' : ''}`}>
                                     {isMobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-primary" />}
                                 </div>
                             </button>
                        </div>
                    </div>
                </div>

                {/* --- MODIFIED: Mobile Menu --- */}
                <div ref={mobileMenuRef} className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] py-4 px-2' : 'max-h-0'}`}>
                    <div className="flex flex-col space-y-2">
                        <MobileNavLink href="/">Home</MobileNavLink>
                        <MobileNavLink href="/browse">Listings</MobileNavLink>
                        <MobileNavLink href="/pricing">Pricing</MobileNavLink>
                        <MobileNavLink href="/support">Support</MobileNavLink>

                        <div className="h-px bg-gray-200/80 my-3"></div>

                        {userInfo ? (
                            <div className="px-2">
                                <div className="px-2 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">My Account</div>
                                <AuthLinks />
                            </div>
                        ) : (
                            <>
                                <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">Sign In / Sign Up</div>
                                <Link to="/student/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-semibold text-text-primary hover:bg-secondary hover:text-primary transition-colors duration-200 rounded-lg"><LogIn className="mr-3 h-5 w-5" />Student Login</Link>
                                <Link to="/student/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-semibold text-text-primary hover:bg-secondary hover:text-primary transition-colors duration-200 rounded-lg"><UserPlus className="mr-3 h-5 w-5" />Student Signup</Link>
                                <div className="h-px bg-gray-200/80 my-2"></div>
                                <Link to="/faculty/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-semibold text-text-primary hover:bg-secondary hover:text-primary transition-colors duration-200 rounded-lg"><LogIn className="mr-3 h-5 w-5" />Mentor Login</Link>
                                <Link to="/faculty/signup" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-3 text-base font-semibold text-text-primary hover:bg-secondary hover:text-primary transition-colors duration-200 rounded-lg"><UserPlus className="mr-3 h-5 w-5" />Mentor Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;