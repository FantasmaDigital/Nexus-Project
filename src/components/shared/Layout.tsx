import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

export const Layout = () => {
    return (
        <main className="flex flex-row w-full h-screen overflow-hidden bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full transition-all duration-300">
                <Navbar />
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </main>
    );
};