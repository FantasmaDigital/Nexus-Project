import React from "react";
import { FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";

interface InventoryTableProps {
    data: any[];
    schema: any[];
    onEdit?: (item: any) => void;
    onDelete?: (id: string) => void;
    renderExtraHeaders?: () => React.ReactNode;
    renderExtraColumns?: (item: any) => React.ReactNode;
    emptyMessage?: string;
    className?: string;
    showDate?: boolean;
}

export const InventoryTable = ({
    data,
    schema,
    onEdit,
    onDelete,
    renderExtraHeaders,
    renderExtraColumns,
    emptyMessage = "No hay registros disponibles",
    className = "",
    showDate = true
}: InventoryTableProps) => {
    return (
        <div className={`max-w-full min-w-0 bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col ${className}`}>
            <div className="w-full overflow-x-auto overflow-y-auto custom-scrollbar flex-1">
                <table className="min-w-full text-left border-separate border-spacing-0 table-auto">
                    <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-sm z-30 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <tr>
                            <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 bg-slate-50 min-w-[100px]">ID Ref</th>
                            {renderExtraHeaders && renderExtraHeaders()}
                            {showDate && (
                                <th className="px-4 py-3 whitespace-nowrap border-b border-slate-200 bg-slate-50 min-w-[140px]">Fecha Registro</th>
                            )}
                            {schema.map(s => (
                                <th key={s.id} className="px-4 py-3 whitespace-nowrap border-b border-slate-200 min-w-[160px] bg-slate-50">{s.keyName}</th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-4 py-3 text-right sticky right-0 bg-slate-50 border-b border-l border-slate-200 z-40">Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                                        #{item.id?.split('-')[0] || '---'}
                                    </td>
                                    {renderExtraColumns && renderExtraColumns(item)}
                                    {showDate && (
                                        <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                            {item.date || item.createdAt || '---'}
                                        </td>
                                    )}
                                    {schema.map(s => (
                                        <td key={s.id} className="px-4 py-3 text-brand-primary font-medium whitespace-nowrap">
                                            <div className="max-w-[300px] truncate">
                                                {s.type === 'image' ? (
                                                    item[s.keyName] || (item.details && item.details[s.keyName]) ? (
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-10 w-10 rounded border border-slate-200 overflow-hidden bg-slate-50 flex-shrink-0">
                                                                <img
                                                                    src={
                                                                        typeof (item[s.keyName] || item.details[s.keyName]) === 'string'
                                                                            ? (item[s.keyName] || item.details[s.keyName])
                                                                            : URL.createObjectURL((item[s.keyName] || item.details[s.keyName])[0])
                                                                    }
                                                                    alt="Preview"
                                                                    className="h-full w-full object-cover"
                                                                    onLoad={(e) => {
                                                                        if (!(typeof (item[s.keyName] || item.details[s.keyName]) === 'string')) {
                                                                            URL.revokeObjectURL((e.target as HTMLImageElement).src);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-300 italic text-xs">Sin imagen</span>
                                                    )
                                                ) : (
                                                    (item[s.keyName] || (item.details && item.details[s.keyName])) || <span className="text-slate-300 italic">--</span>
                                                )}
                                            </div>
                                        </td>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <td className="px-4 py-3 text-right sticky right-0 bg-white group-hover:bg-slate-50 border-l border-slate-100 transition-colors z-10 shadow-[-4px_0_4px_-2px_rgba(0,0,0,0.05)]">
                                            <div className="flex items-center justify-end gap-1">
                                                {onEdit && (
                                                    <button onClick={() => onEdit(item)} className="p-1.5 text-slate-400 hover:text-brand-quaternary hover:bg-blue-50 rounded transition-colors">
                                                        <FiEdit2 size={14} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                        <FiTrash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={schema.length + (showDate ? 3 : 2) + (renderExtraHeaders ? 1 : 0)} className="px-6 py-20 text-center">
                                    <div className="flex flex-col items-center text-slate-400">
                                        <FiPackage size={24} className="mb-2 opacity-20" />
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
