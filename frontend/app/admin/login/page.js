"use client";

import Image from "next/image";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8 bg-white">
            <Image
                height={100}
                width={100}
                src="/logo.png"
                alt="Chithi's Foods Logo"
                className="mb-8 w-56"
            />
            <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold text-center mb-12 text-gray-800">Sign In</h2>
                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Email Address"
                        className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>
                <button
                    className="mt-5 w-full px-4 py-2 text-white bg-pink-500 rounded-md hover:bg-pink-600"
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
