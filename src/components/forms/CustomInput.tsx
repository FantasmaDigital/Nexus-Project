export const CustomInput = ({ label, type, register, name }: any) => (
    <div className="flex flex-col gap-1 w-full">
        <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
        <input
            type={type}
            {...register(name)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder={`Ingrese ${label}...`}
        />
    </div>
);