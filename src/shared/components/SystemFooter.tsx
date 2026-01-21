export const SystemFooter = () => {
    return (
        <footer className="h-8 bg-white border-t border-slate-200 px-6 flex items-center justify-between text-[10px] text-slate-400 font-medium uppercase shrink-0">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm" />
                    Sistema Operativo v2.4
                </span>
                <span>Nexus ERP Enterprise</span>
            </div>
            <span>© 2026 Reservados todos los derechos</span>
        </footer>
    );
};
