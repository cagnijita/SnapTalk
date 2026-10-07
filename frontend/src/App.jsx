import React from 'react';
import {useState} from 'react';
import { Routes, Route } from 'react-router'
import SignUpPage from './pages/SignUpPage'
import ChatPage from './pages/ChatPage'
import LoginPage from './pages/LoginPage'
import { useAuthStore } from './store/useAuthStore';

function App() {
const { authUser, isLoggedIn, login } = useAuthStore();
console.log("authUser:", authUser);
console.log("isLoggedIn:", isLoggedIn);

  return (
    <div className="min-h-screen bg-gray-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Glow Shape (Ambient Light) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Your Content Container */}
      <div className="relative z-10 w-full max-w-6xl flex justify-center items-center">
        <button onClick={login} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">Login</button>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </div>
  )
}

      export default App;
