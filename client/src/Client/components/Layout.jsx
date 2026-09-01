import { useEffect, useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    UserIcon,
    HomeIcon,
    ShoppingBagIcon,
    HeartIcon,
    ShoppingCartIcon,
    XMarkIcon,
    Bars3Icon
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeIconSolid,
    ShoppingBagIcon as ShoppingBagIconSolid,
    HeartIcon as HeartIconSolid,
    ShoppingCartIcon as ShoppingCartIconSolid,
    UserIcon as UserIconSolid
} from "@heroicons/react/24/solid";
import { useAppStore } from "../../stores/useAppStore";

export default function ClientLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);

    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isLoggedIn = !!localStorage.getItem("token");

    const cartItems = useAppStore((state) => state.cartItems) || [];
    const wishlistItems = useAppStore((state) => state.wishlistItems) || [];
    const fetchCart = useAppStore((state) => state.fetchCart);
    const fetchWishlist = useAppStore((state) => state.fetchWishlist);
    const invalidate = useAppStore((state) => state.invalidate);
    const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const wishlistCount = wishlistItems.length;

    useEffect(() => {
        if (!isLoggedIn) return;
        if (!useAppStore.getState().cartItems) fetchCart();
        if (!useAppStore.getState().wishlistItems) fetchWishlist();
    }, [isLoggedIn, fetchCart, fetchWishlist]);

    useEffect(() => {
        const refreshBadges = () => {
            if (isLoggedIn) {
                invalidate("cart", "wishlist");
                fetchCart();
                fetchWishlist();
            }
        };

        window.addEventListener("cartChanged", refreshBadges);
        window.addEventListener("wishlistChanged", refreshBadges);
        return () => {
            window.removeEventListener("cartChanged", refreshBadges);
            window.removeEventListener("wishlistChanged", refreshBadges);
        };
    }, [isLoggedIn, fetchCart, fetchWishlist, invalidate]);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleUserChange = () => {
            window.location.reload();
        };
        window.addEventListener("userChanged", handleUserChange);
        
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        return () => {
            window.removeEventListener("userChanged", handleUserChange);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged"));
        setMobileMenuOpen(false);
        navigate("/");
    };

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstallBanner(false);
        }
        setDeferredPrompt(null);
    };

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/products", label: "Shop Art" },
        { to: "/gallery", label: "Gallery" },
    ];

    const actionLinks = [
        { to: "/wishlist", icon: HeartIcon, solidIcon: HeartIconSolid, badge: wishlistCount, protected: true },
        { to: "/cart", icon: ShoppingCartIcon, solidIcon: ShoppingCartIconSolid, badge: cartCount, protected: true },
        { to: "/orders", icon: UserIcon, solidIcon: UserIconSolid, protected: true },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-brand-light pb-[72px] md:pb-0 font-sans">
            {/* Install App Banner */}
            {showInstallBanner && (
                <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 md:right-8 z-[100] w-[92%] sm:w-[400px] bg-[#12343b] rounded-2xl shadow-[0_15px_50px_rgba(45,84,94,0.4)] border border-[#c89666]/30 p-4 flex items-center justify-between transition-all animate-fade-in-up">
                    <div className="flex items-center gap-4">
                        <img referrerPolicy="no-referrer" src="/logo.png" alt="App Icon" className="w-12 h-12 rounded-xl object-cover shadow-inner" />
                        <div>
                            <p className="font-bold text-white text-base leading-tight">Install Tohfabox25</p>
                            <p className="text-sm text-[#e1b382] mt-0.5 font-medium">Faster, offline access!</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={handleInstallClick} className="bg-[#e1b382] text-[#12343b] px-5 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-[#c89666] transition-colors uppercase tracking-wide">
                            Get
                        </button>
                        <button onClick={() => setShowInstallBanner(false)} className="p-1.5 text-[#7a8f94] hover:text-white transition rounded-full hover:bg-white/10">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
            
            {/* Premium Header */}
            <header className={`fixed w-full top-0 z-40 transition-all duration-500 border-b ${
                scrolled 
                ? "bg-[#0f2b31]/95 backdrop-blur-xl shadow-[0_12px_35px_rgba(18,52,59,0.18)] border-[#e1b382]/25 py-2 md:py-3" 
                : "bg-[#12343b] border-[#e1b382]/15 py-4 md:py-5"
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16">
                        
                        {/* Mobile: Hamburger Left */}
                        <div className="flex-1 md:hidden flex justify-start">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-2 -ml-2 text-[#e1b382] hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <Bars3Icon className="w-8 h-8" />
                            </button>
                        </div>

                        {/* Logo: Center on Mobile, Left on Desktop */}
                        <div className="flex-1 md:flex-none flex justify-center md:justify-start">
                            <Link to="/" className="flex items-center gap-3 group">
                                <img referrerPolicy="no-referrer" src="/logo.png" alt="Tohfabox25 Logo" className="w-10 h-10 md:w-11 md:h-11 rounded-lg object-cover shadow-[0_0_20px_rgba(225,179,130,0.3)] transform group-hover:scale-105 transition-all duration-300" />
                                <h1 className="text-2xl md:text-3xl font-extrabold text-[#e1b382] tracking-tight drop-shadow-md font-serif hidden sm:block">
                                    Tohfabox<span className="text-white font-light">25</span>
                                </h1>
                            </Link>
                        </div>

                        {/* Desktop Navigation (Center) */}
                            <nav className="hidden md:flex flex-1 justify-center items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative text-sm font-bold transition-colors tracking-[0.08em] uppercase ${isActive(link.to)
                                        ? "text-[#e1b382]"
                                        : "text-[#fdfbf9] hover:text-[#e1b382]"
                                        }`}
                                >
                                    {link.label}
                                    {isActive(link.to) && (
                                        <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-[#e1b382] rounded-full shadow-[0_0_8px_rgba(225,179,130,0.8)]"></span>
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions (Right) & Mobile Cart (Right) */}
                        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
                            
                            {/* Desktop: Icons */}
                            <div className="hidden md:flex items-center gap-6">
                                {actionLinks.map((link) => (
                                    (!link.protected || isLoggedIn) && (
                                        <Link key={link.to} to={link.to} className="relative group p-2">
                                            {isActive(link.to) ? (
                                                <link.solidIcon className="w-6 h-6 text-[#e1b382]" />
                                            ) : (
                                                <link.icon className="w-6 h-6 text-[#fdfbf9] group-hover:text-[#e1b382] transition-colors" />
                                            )}
                                            {link.badge > 0 && (
                                                <span className="absolute top-0 right-0 bg-[#c89666] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-brand-dark shadow-sm">
                                                    {link.badge > 99 ? '99+' : link.badge}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                ))}

                                {/* Sign In Button */}
                                {!isLoggedIn && (
                                    <Link
                                        to="/login"
                                        state={{ from: location }}
                                        className="ml-2 text-sm font-bold text-[#12343b] bg-[#e1b382] hover:bg-[#c89666] hover:text-white px-6 py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(225,179,130,0.4)] hover:shadow-[0_0_20px_rgba(200,150,102,0.6)]"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </div>

                            {/* Mobile: Quick Cart Icon */}
                            <div className="md:hidden flex items-center justify-end">
                                <Link to="/cart" className="relative p-2 -mr-2 text-[#e1b382]">
                                    {isActive("/cart") ? <ShoppingCartIconSolid className="w-7 h-7" /> : <ShoppingCartIcon className="w-7 h-7" />}
                                    {cartCount > 0 && (
                                        <span className="absolute top-0 right-0 bg-[#c89666] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-brand-dark shadow-sm">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            {/* Slide-out Mobile Menu (Drawer) */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-[#12343b]/80 backdrop-blur-sm transition-opacity" 
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>
                    
                    {/* Drawer Content */}
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#12343b] shadow-2xl border-r border-[#c89666]/20 animate-slide-in-left">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img referrerPolicy="no-referrer" src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl" />
                                <span className="text-xl font-black text-[#e1b382] font-serif">Tohfabox25</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-full text-[#fdfbf9] hover:text-white hover:bg-[#c89666] transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User Info / Login */}
                        <div className="p-6 border-b border-white/10 bg-white/5">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#e1b382] rounded-full flex items-center justify-center shadow-inner">
                                        <UserIconSolid className="w-6 h-6 text-[#12343b]" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#7a8f94] font-medium">Welcome back,</p>
                                        <p className="font-bold text-lg text-white truncate max-w-[150px]">
                                            {user?.name || "User"}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-[#fdfbf9]/80 text-sm mb-4">Sign in to track orders and save to wishlist.</p>
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full py-3 bg-[#e1b382] text-[#12343b] rounded-xl font-bold tracking-wide shadow-lg active:scale-95 transition-transform"
                                    >
                                        Sign In / Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center px-4 py-4 rounded-xl font-bold text-base tracking-wide transition-colors ${
                                        isActive(link.to)
                                        ? "bg-[#e1b382] text-[#12343b]"
                                        : "text-[#fdfbf9] hover:bg-white/10"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="h-px bg-white/10 my-4 mx-4"></div>

                            {/* Additional Links */}
                            <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-[#7a8f94] hover:text-[#fdfbf9] font-medium transition-colors">Our Story</Link>
                            <Link to="/custom-orders" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-[#7a8f94] hover:text-[#fdfbf9] font-medium transition-colors">Custom Orders</Link>
                            <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-[#7a8f94] hover:text-[#fdfbf9] font-medium transition-colors">Support & FAQ</Link>
                        </nav>

                        {/* Logout at bottom if logged in */}
                        {isLoggedIn && (
                            <div className="p-6 border-t border-white/10 bg-[#12343b]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex justify-center items-center gap-2 py-4 bg-[#c89666]/20 text-brand-accent hover:bg-[#c89666] hover:text-white rounded-xl font-bold tracking-wide transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 mt-20 md:mt-24">
                <Outlet />
            </main>

            {/* Premium Footer */}
            <footer className="bg-[#0b1c24] text-[#fdfbf9] pt-20 pb-12 border-t-2 border-[#c89666]/30 shadow-[0_-10px_50px_rgba(45,84,94,0.3)]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8 text-center lg:text-left mb-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                            <img referrerPolicy="no-referrer" src="/logo.png" alt="Tohfabox25 Logo" className="w-14 h-14 rounded-xl object-cover shadow-[0_0_20px_rgba(225,179,130,0.3)]" />
                            <h2 className="text-4xl font-extrabold text-[#e1b382] drop-shadow-md font-serif">
                                Tohfabox<span className="text-white font-light">25</span>
                            </h2>
                        </div>
                        <p className="text-[#fdfbf9]/70 font-light leading-relaxed text-lg max-w-md mx-auto lg:mx-0">
                            Handcrafted luxury. We create mesmerizing resin art and personalized gifts that capture beautiful memories in perfect clarity.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 tracking-widest uppercase text-[#e1b382]">Explore</h3>
                        <div className="flex flex-col gap-4 text-[#fdfbf9]/80 font-medium">
                            <Link to="/products" className="hover:text-[#e1b382] transition-colors">All Art Pieces</Link>
                            <Link to="/gallery" className="hover:text-[#e1b382] transition-colors">Gallery</Link>
                            <Link to="/custom-orders" className="hover:text-[#e1b382] transition-colors">Custom Orders</Link>
                            <Link to="/about" className="hover:text-[#e1b382] transition-colors">Our Story</Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-6 tracking-widest uppercase text-[#e1b382]">Support</h3>
                        <div className="flex flex-col gap-4 text-[#fdfbf9]/80 font-medium">
                            <Link to="/contact" className="hover:text-[#e1b382] transition-colors">Contact Us</Link>
                            <Link to="/shipping" className="hover:text-[#e1b382] transition-colors">Shipping Policy</Link>
                            <Link to="/returns" className="hover:text-[#e1b382] transition-colors">Returns & Exchanges</Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 border-t border-brand-light/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[#7a8f94] font-medium">
                    <p>© {new Date().getFullYear()} Tohfabox25. All rights reserved.</p>
                    <div className="flex gap-6 mt-6 md:mt-0">
                        <Link to="/privacy" className="hover:text-[#e1b382] transition-colors">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-[#e1b382] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>

            {/* App-like Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#fdfbf9] border-t border-[#c89666]/20 flex justify-around items-center h-[72px] z-40 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_30px_-10px_rgba(45,84,94,0.15)]">
                <Link to="/" className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                    {isActive("/") ? <HomeIconSolid className="w-7 h-7 text-[#12343b]" /> : <HomeIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                    <span className={`text-[11px] font-black tracking-wide ${isActive("/") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Home</span>
                </Link>
                <Link to="/products" className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                    {isActive("/products") ? <ShoppingBagIconSolid className="w-7 h-7 text-[#12343b]" /> : <ShoppingBagIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                    <span className={`text-[11px] font-black tracking-wide ${isActive("/products") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Shop</span>
                </Link>
                {isLoggedIn ? (
                    <>
                        <Link to="/wishlist" className="relative flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                            {isActive("/wishlist") ? <HeartIconSolid className="w-7 h-7 text-[#12343b]" /> : <HeartIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                            {wishlistCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-[#c89666] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">{wishlistCount}</span>}
                            <span className={`text-[11px] font-black tracking-wide ${isActive("/wishlist") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Wishlist</span>
                        </Link>
                        <Link to="/cart" className="relative flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                            {isActive("/cart") ? <ShoppingCartIconSolid className="w-7 h-7 text-[#12343b]" /> : <ShoppingCartIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                            {cartCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-[#2d545e] text-[#12343b] text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
                            <span className={`text-[11px] font-black tracking-wide ${isActive("/cart") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Cart</span>
                        </Link>
                        <Link to="/orders" className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                            {isActive("/orders") ? <UserIconSolid className="w-7 h-7 text-[#12343b]" /> : <UserIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                            <span className={`text-[11px] font-black tracking-wide ${isActive("/orders") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Account</span>
                        </Link>
                    </>
                ) : (
                    <Link to="/login" className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                        <UserIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />
                        <span className="text-[11px] font-black tracking-wide text-[#7a8f94]">Sign In</span>
                    </Link>
                )}
            </div>
        </div>
    );
}