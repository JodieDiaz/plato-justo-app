"use client";

import React from 'react';
import { signIn } from "next-auth/react";
import { FaFacebook } from 'react-icons/fa';

const LoginButtonFacebook = () => {
    return (
        <div>
            <button onClick={() => signIn("facebook")} className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2">
                <FaFacebook />
                <span>Login con Facebook</span>
            </button>
        </div>
    );
};

export default LoginButtonFacebook;
