import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../../../store/product.schema.zod";

export const IsAuth = ({ children }: { children: ReactNode }) => {
    const isConfigured = useUserStore((state) => state.isConfigured);
    const location = useLocation();

    if (!isConfigured) return <Navigate to="/auth" state={{ from: location }} replace />;

    return <>{children}</>;
};