"use client";

import React from 'react';
import { signIn } from "next-auth/react";
import { FaGoogle } from 'react-icons/fa';

const LoginButtonGoogle = () => {
    return (
        <div>
            <button onClick={() => signIn("google")} className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <FaGoogle />
                <span>Login con Google</span>
            </button>
        </div>
    );
};

export default LoginButtonGoogle;


