"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUser, FaCartArrowDown, FaSearch } from 'react-icons/fa';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [login, setLogin] = useState(false);
    const [profile, setProfile] = useState(false);
    const [jwt, setJwt] = useState(undefined);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedJwt = sessionStorage.getItem("jwt");
        setJwt(storedJwt);

        if (!storedJwt || storedJwt === "undefined" || storedJwt === null) {
            if (pathname.includes("profile")) {
                router.push("/login");
                setLogin(false);
            } else {
                setLogin(true);
            }
        } else {
            setLogin(true);
        }
    }, [pathname]);

    const handleUserClick = () => {
        if (!login) {
            router.push('/login');
        }
    };

    const toggleProfile = () => {
        setProfile(!profile);
    };

    const handleLogout = () => {
        sessionStorage.removeItem("jwt");
        sessionStorage.removeItem("user");
        window.location.reload();
    };

    return (
        <>
            <nav className="bg-white border-gray-200 h-16 max-h-16 sticky top-0 w-full z-50 shadow-lg">
                <div className="max-w-screen-xl flex flex-wrap items-center md:justify-around justify-between mx-auto p-4">
                    <Link href="/" className="flex items-center space-x-3">
                        <img height={36} width={48} src="/logo.png" className="w-12 h-fit scale-150" alt={process.env.NEXT_PUBLIC_NAME} />
                    </Link>

                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0">
                        <Link href="/search" className="flex h-10 w-10 items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400">
                            <FaSearch />
                        </Link>
                        <Link href="/cart" className="flex h-10 w-10 items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400">
                            <FaCartArrowDown />
                        </Link>
                        {login ? (
                            <div onClick={toggleProfile} onBlur={() => setProfile(false)} className="flex h-10 w-10 cursor-pointer items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400">
                                <span className="sr-only">Open user menu</span>
                                <Image height={32} width={32} className="w-8 h-8 rounded-full" src="/logo.png" alt="user photo" />
                            </div>
                        ) : (
                            <button onClick={handleUserClick} className="flex h-10 w-10 items-center justify-center text-sm bg-pink-100 rounded-full border-2 border-white focus:border-gray-400">
                                <span className="sr-only">Open user menu</span>
                                <FaUser />
                            </button>
                        )}
                        <button onClick={() => setMenuOpen(!menuOpen)} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-user" aria-expanded={menuOpen ? 'true' : 'false'}>
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>

                    <div className={`${menuOpen ? 'block' : 'hidden'} items-center justify-between w-full md:flex md:w-auto md:order-1`} id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
                            <li>
                                <Link href="/" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 font-semibold md:p-0">Home</Link>
                            </li>
                            <li>
                                <Link href="/menu" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 font-semibold md:p-0">Menu</Link>
                            </li>
                            <li>
                                <Link href="/services" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-slate-700 font-semibold md:p-0">Services</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {profile && (
                <div className="fixed md:right-4 right-4 top-16 z-10 mt-2 w-48 bg-white border rounded-md shadow-lg">
                    <ul className="flex flex-col">
                        <li>
                            <Link href="/profile/account-settings" onClick={() => setProfile(false)} className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100">Account Settings</Link>
                        </li>
                        <li>
                            <Link href="/profile/order-history" onClick={() => setProfile(false)} className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100">Order History</Link>
                        </li>
                        <li>
                            <Link href="/become-vendor" onClick={() => setProfile(false)} className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100">Become a Vendor</Link>
                        </li>
                        <li>
                            <div onClick={handleLogout} className="block px-4 py-2 font-semibold text-orange-900 hover:bg-orange-100">Logout</div>
                        </li>
                    </ul>
                </div>
            )}
        </>
    );
}
