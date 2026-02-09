// src/layouts/AppLayout.tsx
import { Sidebar } from "../Sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
