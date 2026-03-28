import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import { Toaster } from '../components/ui/sonner';
import React from "react";

export function Root() {
  return (
    <div className="min-h-screen">
      <Header />
      <Outlet />
      <Toaster position="bottom-center" />
    </div>
  );
}