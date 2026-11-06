import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import ToastContainer from '../common/ToastContainer';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-content selection:bg-brand-100 selection:text-brand-800">
      <Navbar />
      <ToastContainer />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;

