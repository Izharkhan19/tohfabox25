"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    UserIcon,
    HomeIcon,
    ShoppingBagIcon,
    HeartIcon,
    ShoppingCartIcon,
    PhotoIcon,
    XMarkIcon,
    Bars3Icon,
    MagnifyingGlassIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";
import HeaderSearch from "./HeaderSearch";
import {
    HomeIcon as HomeIconSolid,
    ShoppingBagIcon as ShoppingBagIconSolid,
    HeartIcon as HeartIconSolid,
    ShoppingCartIcon as ShoppingCartIconSolid,
    UserIcon as UserIconSolid,
    PhotoIcon as PhotoIconSolid
} from "@heroicons/react/24/solid";
import { useAppStore } from "../../stores/useAppStore";
import confetti from "canvas-confetti";
import { AnimatePresence, motion } from "framer-motion";
import { getActiveAnnouncement } from "../../api-services/apiService";

export default function ClientLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [announcement, setAnnouncement] = useState(null);
    const [openFooterSection, setOpenFooterSection] = useState(null);
    const headerRef = useRef(null);
    const [headerHeight, setHeaderHeight] = useState(0);

    const storedUser = (typeof window !== 'undefined' ? localStorage.getItem("user") : null);
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isLoggedIn = !!(typeof window !== 'undefined' ? localStorage.getItem("token") : null);
    const isAdminLoggedIn = user?.role === "admin" ? true : false  //|| !!(typeof window !== 'undefined' ? localStorage.getItem("adminToken") : null);

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
    }, [isLoggedIn, fetchCart, fetchWishlist]);

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

    useEffect(() => {
        const fetchAnnouncement = async () => {
            const res = await getActiveAnnouncement();
            if (res?.success && res?.data) {
                setAnnouncement(res.data?.data || null);
            }
        };
        fetchAnnouncement();
    }, []);

    // Dynamically calculate exact header height to avoid artificial gaps or overlaps
    useEffect(() => {
        const updateHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };
        updateHeight();
        const resizeObserver = new ResizeObserver(() => updateHeight());
        if (headerRef.current) {
            resizeObserver.observe(headerRef.current);
        }
        window.addEventListener("resize", updateHeight);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, [announcement]);

    const isActive = (path) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("userChanged"));
        setMobileMenuOpen(false);
        router.push("/");
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
                            <p className="font-bold text-white text-base leading-tight">Install Artistary Crafts</p>
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
            <header ref={headerRef} className={`fixed w-full top-0 z-40 transition-all duration-300 border-b ${
                scrolled 
                ? "bg-[#0f2b31]/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(18,52,59,0.18)] border-[#e1b382]/25" 
                : "bg-[#12343b] border-[#e1b382]/15"
            }`}>
                {announcement && (
                    <div className="bg-[#e1b382] text-[#12343b] text-[10px] sm:text-xs font-bold py-1 px-3 text-center w-full shadow-xs truncate">
                        {announcement.link ? (
                            <Link href={announcement.link} className="hover:underline inline-flex items-center gap-1.5">
                                <span>{announcement.message}</span> <span aria-hidden="true">&rarr;</span>
                            </Link>
                        ) : (
                            <span>{announcement.message}</span>
                        )}
                    </div>
                )}
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-11 md:h-16">
                        
                        {/* Mobile: Hamburger Left + Brand */}
                        <div className="md:hidden flex items-center gap-2 flex-1">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-1.5 -ml-1 text-[#e1b382] hover:bg-white/10 rounded-lg transition-colors"
                                aria-label="Open menu"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <Link 
                                href="/" 
                                className="flex items-center gap-2 group"
                                onClick={() => {
                                    confetti({
                                        particleCount: 100,
                                        spread: 70,
                                        origin: { y: 0.2, x: 0.1 },
                                        colors: ['#e1b382', '#c89666', '#ffffff']
                                    });
                                }}
                            >
                                <img referrerPolicy="no-referrer" src="/logo.png" alt="Artistary Crafts Logo" className="w-8 h-8 rounded-lg object-cover shadow-[0_0_15px_rgba(225,179,130,0.3)] transform group-hover:scale-105 active:scale-95 transition-all duration-300" />
                                <span className="text-base font-extrabold text-[#e1b382] tracking-tight drop-shadow-md font-serif">
                                    Artistary Crafts
                                </span>
                            </Link>
                        </div>

                        {/* Desktop: Logo Left */}
                        <div className="hidden md:flex flex-none justify-start">
                            <Link 
                                href="/" 
                                className="flex items-center gap-3 group"
                                onClick={() => {
                                    confetti({
                                        particleCount: 100,
                                        spread: 70,
                                        origin: { y: 0.2, x: 0.1 },
                                        colors: ['#e1b382', '#c89666', '#ffffff']
                                    });
                                }}
                            >
                                <img referrerPolicy="no-referrer" src="/logo.png" alt="Artistary Crafts Logo" className="w-10 h-10 md:w-11 md:h-11 rounded-lg object-cover shadow-[0_0_20px_rgba(225,179,130,0.3)] transform group-hover:scale-105 active:scale-95 transition-all duration-300" />
                                <h1 className="text-2xl md:text-3xl font-extrabold text-[#e1b382] tracking-tight drop-shadow-md font-serif">
                                    Artistary Crafts
                                </h1>
                            </Link>
                        </div>

                        {/* Desktop Navigation (Center) */}
                        <nav className="hidden md:flex flex-1 justify-center items-center gap-6 lg:gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    href={link.to}
                                    className={`relative text-xs lg:text-sm font-bold transition-colors tracking-[0.08em] uppercase ${isActive(link.to)
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

                        {/* Desktop Live Search */}
                        <div className="hidden lg:block w-48 xl:w-64 mx-2">
                            <HeaderSearch />
                        </div>

                        {/* Desktop Actions (Right) & Mobile Cart (Right) */}
                        <div className="flex justify-end items-center gap-2 md:gap-4 lg:gap-6">
                            
                            {/* Desktop: Icons */}
                            <div className="hidden md:flex items-center gap-4 lg:gap-6">
                                {actionLinks.map((link) => (
                                    (!link.protected || isLoggedIn) && (
                                        <Link key={link.to} href={link.to} className="relative group p-2">
                                            {isActive(link.to) ? (
                                                <link.solidIcon className="w-5 h-5 lg:w-6 lg:h-6 text-[#e1b382]" />
                                            ) : (
                                                <link.icon className="w-5 h-5 lg:w-6 lg:h-6 text-[#fdfbf9] group-hover:text-[#e1b382] transition-colors" />
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
                                        href="/login"
                                        className="ml-2 text-xs lg:text-sm font-bold text-[#12343b] bg-[#e1b382] hover:bg-[#c89666] hover:text-white px-5 lg:px-6 py-2 lg:py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(225,179,130,0.4)] hover:shadow-[0_0_20px_rgba(200,150,102,0.6)]"
                                    >
                                        Sign In
                                    </Link>
                                )}

                                {/* Admin Panel Button */}
                                {isAdminLoggedIn && (
                                    <Link
                                        href="/admin"
                                        className="ml-2 text-xs lg:text-sm font-bold text-white bg-red-600 hover:bg-red-700 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </div>

                            {/* Mobile: Account & Cart Icons */}
                            <div className="md:hidden flex items-center justify-end gap-1">
                                <Link
                                    href={isLoggedIn ? "/orders" : "/login"}
                                    className="p-1.5 text-[#e1b382] hover:bg-white/10 rounded-lg transition-colors"
                                    title={isLoggedIn ? "Account / Orders" : "Sign In"}
                                >
                                    {isActive("/orders") || (!isLoggedIn && isActive("/login")) ? (
                                        <UserIconSolid className="w-6 h-6" />
                                    ) : (
                                        <UserIcon className="w-6 h-6" />
                                    )}
                                </Link>
                                <Link href="/cart" className="relative p-1.5 -mr-1 text-[#e1b382] hover:bg-white/10 rounded-lg transition-colors">
                                    {isActive("/cart") ? <ShoppingCartIconSolid className="w-6 h-6" /> : <ShoppingCartIcon className="w-6 h-6" />}
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 bg-[#c89666] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#12343b] shadow-sm">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>

                        </div>
                    </div>

                    {/* Mobile: Functional Live Search Input */}
                    <div className="md:hidden pt-0.5 pb-1.5">
                        <HeaderSearch isMobile />
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
                    <div className="relative flex-1 flex flex-col w-[260px] max-w-[80vw] bg-[#12343b] shadow-2xl border-r border-[#c89666]/20 animate-slide-in-left">
                        {/* Drawer Header */}
                        <div className="px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <img referrerPolicy="no-referrer" src="/logo.png" alt="Logo" className="w-7 h-7 rounded-lg" />
                                <span className="text-sm font-bold text-[#e1b382] font-serif truncate">Artistary Crafts</span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-1 bg-white/5 rounded-full text-[#fdfbf9] hover:text-white hover:bg-[#c89666] transition-colors">
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>

                        {/* User Info / Login */}
                        <div className="px-3.5 py-2 border-b border-white/10 bg-white/5">
                            {isLoggedIn ? (
                                <Link
                                    href="/orders"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-2.5 group hover:bg-white/5 p-1 -m-1 rounded-lg transition-all"
                                >
                                    <div className="w-8 h-8 bg-[#e1b382] rounded-full flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform shrink-0">
                                        <UserIconSolid className="w-4 h-4 text-[#12343b]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] text-[#7a8f94] font-medium leading-none">Welcome back,</p>
                                        <p className="font-bold text-xs text-white truncate mt-0.5">
                                            {user?.name || "User"}
                                        </p>
                                        <p className="text-[10px] text-[#e1b382] font-semibold flex items-center gap-1 group-hover:underline">
                                            Manage Account &rarr;
                                        </p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="text-center py-1">
                                    <p className="text-[#fdfbf9]/80 text-[11px] mb-1.5 leading-tight">Sign in to track orders and save wishlist.</p>
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block w-full py-1.5 bg-[#e1b382] text-[#12343b] rounded-lg font-bold text-xs tracking-wide shadow-md active:scale-95 transition-transform"
                                    >
                                        Sign In / Register
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 px-2.5 py-1.5 space-y-0.5 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    href={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center px-3 py-2 rounded-xl font-semibold text-xs tracking-wide transition-colors ${
                                        isActive(link.to)
                                        ? "bg-[#e1b382] text-[#12343b] font-bold shadow-sm"
                                        : "text-[#fdfbf9] hover:bg-white/10"
                                    }`}
                                >
                                    <span className="truncate">{link.label}</span>
                                </Link>
                            ))}

                            {isLoggedIn && (
                                <Link
                                    href="/orders"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-xs tracking-wide transition-colors ${
                                        isActive("/orders")
                                        ? "bg-[#e1b382] text-[#12343b] font-bold shadow-sm"
                                        : "text-[#fdfbf9] hover:bg-white/10"
                                    }`}
                                >
                                    <UserIcon className="w-3.5 h-3.5 text-[#e1b382] shrink-0" />
                                    <span className="truncate">My Account & Orders</span>
                                </Link>
                            )}

                            <div className="h-px bg-white/10 my-1.5 mx-1"></div>

                            {/* Additional Links */}
                            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-[11px] text-[#7a8f94] hover:text-[#fdfbf9] font-medium transition-colors truncate">Our Story</Link>
                            <Link href="/custom-orders" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-[11px] text-[#7a8f94] hover:text-[#fdfbf9] font-medium transition-colors truncate">Custom Orders</Link>
                            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-1.5 text-[11px] text-[#7a8f94] hover:text-[#fdfbf9] font-medium transition-colors truncate">Support & FAQ</Link>
                            
                            {isAdminLoggedIn && (
                                <div className="pt-2 pb-1">
                                    <Link 
                                        href="/admin" 
                                        onClick={() => setMobileMenuOpen(false)} 
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-red-200 bg-red-950/40 border border-red-500/30 rounded-xl font-bold text-xs hover:bg-red-900/60 transition-colors"
                                    >
                                        <span>Admin Panel</span>
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Logout at bottom if logged in */}
                        {isLoggedIn && (
                            <div className="p-2.5 border-t border-white/10 bg-[#12343b]">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex justify-center items-center gap-2 py-1.5 bg-[#c89666]/20 text-brand-accent hover:bg-[#c89666] hover:text-white rounded-lg font-bold text-xs tracking-wide transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main 
                className={`flex-1 w-full ${!headerHeight ? (announcement ? 'pt-[106px] md:pt-[84px]' : 'pt-[82px] md:pt-[64px]') : ''}`}
                style={headerHeight ? { paddingTop: `${headerHeight}px` } : undefined}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="min-h-full flex flex-col"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Premium Footer */}
            <footer className="bg-[#0b1c24] text-[#fdfbf9] pt-6 pb-6 md:pt-14 md:pb-10 border-t-2 border-[#c89666]/30 shadow-[0_-10px_50px_rgba(45,84,94,0.3)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-4 md:mb-10">
                    <div className="md:col-span-2 text-left">
                        <div className="flex items-center gap-2.5 mb-2">
                            <img referrerPolicy="no-referrer" src="/logo.png" alt="Artistary Crafts Logo" className="w-8 h-8 md:w-12 md:h-12 rounded-xl object-cover shadow-[0_0_20px_rgba(225,179,130,0.3)]" />
                            <h2 className="text-lg md:text-2xl font-extrabold text-[#e1b382] drop-shadow-md font-serif">
                                Artistary Crafts
                            </h2>
                        </div>
                        <p className="text-[#fdfbf9]/70 font-light leading-relaxed text-xs md:text-sm max-w-md">
                            Handcrafted luxury. We create mesmerizing crochet art and personalized gifts that capture beautiful memories in perfect clarity.
                        </p>
                    </div>

                    {/* Explore Column - Collapsible on Mobile */}
                    <div className="border-t border-white/5 md:border-t-0 pt-2.5 md:pt-0">
                        <button
                            type="button"
                            onClick={() => setOpenFooterSection(prev => prev === 'explore' ? null : 'explore')}
                            className="w-full flex items-center justify-between text-xs md:text-sm font-bold tracking-wider uppercase text-[#e1b382] mb-1.5 md:mb-2.5 cursor-pointer py-1"
                        >
                            <span>Explore</span>
                            <ChevronDownIcon className={`w-3.5 h-3.5 md:hidden transition-transform duration-200 ${openFooterSection === 'explore' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1.5 text-xs text-[#fdfbf9]/75 font-medium transition-all ${openFooterSection === 'explore' ? 'block' : 'hidden md:flex'}`}>
                            <Link href="/products" className="hover:text-[#e1b382] transition-colors py-0.5">All Art Pieces</Link>
                            <Link href="/gallery" className="hover:text-[#e1b382] transition-colors py-0.5">Gallery</Link>
                            <Link href="/custom-orders" className="hover:text-[#e1b382] transition-colors py-0.5">Custom Orders</Link>
                            <Link href="/about" className="hover:text-[#e1b382] transition-colors py-0.5">Our Story</Link>
                        </div>
                    </div>

                    {/* Support Column - Collapsible on Mobile */}
                    <div className="border-t border-white/5 md:border-t-0 pt-2.5 md:pt-0">
                        <button
                            type="button"
                            onClick={() => setOpenFooterSection(prev => prev === 'support' ? null : 'support')}
                            className="w-full flex items-center justify-between text-xs md:text-sm font-bold tracking-wider uppercase text-[#e1b382] mb-1.5 md:mb-2.5 cursor-pointer py-1"
                        >
                            <span>Support</span>
                            <ChevronDownIcon className={`w-3.5 h-3.5 md:hidden transition-transform duration-200 ${openFooterSection === 'support' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`flex flex-col gap-1.5 text-xs text-[#fdfbf9]/75 font-medium transition-all ${openFooterSection === 'support' ? 'block' : 'hidden md:flex'}`}>
                            <Link href="/contact" className="hover:text-[#e1b382] transition-colors py-0.5">Contact Us</Link>
                            <Link href="/shipping" className="hover:text-[#e1b382] transition-colors py-0.5">Shipping Policy</Link>
                            <Link href="/returns" className="hover:text-[#e1b382] transition-colors py-0.5">Returns & Exchanges</Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 border-t border-brand-light/10 pt-3 flex flex-col sm:flex-row justify-between items-center text-[10px] md:text-xs text-[#7a8f94] font-medium gap-1.5">
                    <p>© {new Date().getFullYear()} Artistary Crafts. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-[#e1b382] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#e1b382] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>

            {/* App-like Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#fdfbf9] border-t border-[#c89666]/20 flex justify-around items-center h-[72px] z-40 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-5px_30px_-10px_rgba(45,84,94,0.15)]">
                <Link href="/" className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                    {isActive("/") ? <HomeIconSolid className="w-7 h-7 text-[#12343b]" /> : <HomeIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                    <span className={`text-[11px] font-black tracking-wide ${isActive("/") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Home</span>
                </Link>
                <Link href="/products" className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                    {isActive("/products") ? <ShoppingBagIconSolid className="w-7 h-7 text-[#12343b]" /> : <ShoppingBagIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                    <span className={`text-[11px] font-black tracking-wide ${isActive("/products") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Shop</span>
                </Link>
                <Link href="/gallery" className="flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                    {isActive("/gallery") ? <PhotoIconSolid className="w-7 h-7 text-[#12343b]" /> : <PhotoIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                    <span className={`text-[11px] font-black tracking-wide ${isActive("/gallery") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Gallery</span>
                </Link>
                <Link href="/wishlist" className="relative flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                    {isActive("/wishlist") ? <HeartIconSolid className="w-7 h-7 text-[#12343b]" /> : <HeartIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                    {wishlistCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-[#c89666] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">{wishlistCount}</span>}
                    <span className={`text-[11px] font-black tracking-wide ${isActive("/wishlist") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Wishlist</span>
                </Link>
                <Link href="/cart" className="relative flex flex-col items-center justify-center w-16 h-full gap-1.5 active:scale-95 transition-transform group">
                    {isActive("/cart") ? <ShoppingCartIconSolid className="w-7 h-7 text-[#12343b]" /> : <ShoppingCartIcon className="w-7 h-7 text-[#7a8f94] group-hover:text-[#12343b]" />}
                    {cartCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-[#c89666] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm">{cartCount}</span>}
                    <span className={`text-[11px] font-black tracking-wide ${isActive("/cart") ? "text-[#12343b]" : "text-[#7a8f94]"}`}>Cart</span>
                </Link>
            </div>
        </div>
    );
}