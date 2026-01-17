import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    FiLock, FiArrowRight, FiUser, FiShield,
    FiBox, FiBarChart2, FiCpu, FiTruck,
    FiDatabase, FiDollarSign, FiLayers, FiActivity, FiLoader
} from "react-icons/fi";
import { useUserStore } from "../../store/product.schema.zod";

// 1. Interfaz corregida para coincidir con el registro
interface LoginForm {
    accessKey: string;
    licenseCode: string;
}

export const Auth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    
    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
    const { setUser } = useUserStore();
    const navigate = useNavigate();

    const onLogin = async (data: LoginForm) => {
        setIsLoading(true);
        setAuthError(null);

        // Simulamos latencia de red (2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Credenciales Maestras (Simulación)
        const MASTER_EMAIL = "danielhrndz38@gmail.com";
        const MASTER_TOKEN = "nexus2026"; // Cambia esto por lo que quieras probar

        if (data.accessKey === MASTER_EMAIL && data.licenseCode === MASTER_TOKEN) {
            const user = {
                uuid: crypto.randomUUID(),
                name: "Daniel Hernandez",
                email: data.accessKey,
                role: "Administrator",
                warehouseName: "All Warehouses",
                isConfigured: true // Seteamos el flag de auth
            };
            
            setUser(user);
            navigate("/app/dashboard"); // Redirigimos al entrar
        } else {
            setAuthError("Credenciales inválidas. Verifique su ID de terminal y token de seguridad.");
        }
        setIsLoading(false);
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-slate-200 overflow-hidden relative p-4">
            
            {/* Iconos de fondo (Igual que antes) */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                <FiBox size={320} className="absolute -top-20 -left-20 text-blue-600 -rotate-12" />
                <FiBarChart2 size={280} className="absolute top-1/4 -right-10 text-slate-400 rotate-12" />
                <FiCpu size={380} className="absolute -bottom-20 left-1/3 text-blue-500 opacity-30" />
                <FiTruck size={220} className="absolute top-10 left-1/2 text-slate-400 -rotate-6" />
                <FiDatabase size={300} className="absolute bottom-20 -left-10 text-blue-400" />
                <FiDollarSign size={240} className="absolute bottom-1/4 right-20 text-blue-600 rotate-45" />
                <FiLayers size={320} className="absolute -top-10 right-1/4 text-slate-500 opacity-20" />
                <FiActivity size={180} className="absolute bottom-10 right-1/3 text-blue-600" />
            </div>

            <div className="relative z-10 bg-white/80 backdrop-blur-xl w-full max-w-xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-500">

                <div className="p-12 pb-6 text-center">
                    <div className="w-16 h-16 bg-[#2563eb] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/40">
                        <FiShield size={32} />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                        Nexus <span className="text-[#2563eb]">Enterprise</span>
                    </h2>
                    <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase mt-3">
                        Infrastructure Access Control
                    </p>
                </div>

                <form onSubmit={handleSubmit(onLogin)} className="px-16 py-8 flex flex-col gap-5">
                    
                    {/* Mensaje de Error General */}
                    {authError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 animate-shake">
                            <p className="text-xs text-red-700 font-bold uppercase">{authError}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal ID (Email)</label>
                            <div className="relative">
                                <FiUser className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.accessKey ? 'text-red-400' : 'text-slate-400'}`} />
                                <input
                                    {...register("accessKey", { required: "El ID es obligatorio" })}
                                    className={`w-full bg-white border ${errors.accessKey ? 'border-red-300' : 'border-slate-200'} py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563eb] transition-all text-sm font-bold`}
                                    placeholder="usuario@nexus.com"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Token</label>
                            <div className="relative">
                                <FiLock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.licenseCode ? 'text-red-400' : 'text-slate-400'}`} />
                                <input
                                    {...register("licenseCode", { required: "El token es obligatorio" })}
                                    type="password"
                                    className={`w-full bg-white border ${errors.licenseCode ? 'border-red-300' : 'border-slate-200'} py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#2563eb] transition-all text-sm font-bold tracking-widest`}
                                    placeholder="••••••••••••••••"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-black py-5 shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 active:scale-[0.97] mt-4 uppercase tracking-[0.2em] text-xs disabled:opacity-70"
                    >
                        {isLoading ? (
                            <FiLoader size={20} className="animate-spin" />
                        ) : (
                            <>
                                Verificar Credenciales
                                <FiArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="p-10 pt-0 text-center">
                    <div className="pt-6 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-50 italic">
                            AES-256 Bit Encrypted Connection
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};