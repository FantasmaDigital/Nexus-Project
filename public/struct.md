src/
├── assets/                  # Imágenes estáticas, fuentes, iconos svg globales
├── components/              # "UI KIT": Componentes tontos/genéricos (Botones, Inputs, Modales)
│   ├── ui/                  # Componentes base (Button.tsx, Card.tsx)
│   └── form/                # Inputs especializados (Datepicker.tsx, Select.tsx)
├── config/                  # Variables de entorno y constantes globales
├── features/                # EL NÚCLEO DEL ERP: Módulos de negocio aislados
│   ├── auth/                # Todo lo relacionado con Login/Registro
│   ├── inventory/           # Todo lo relacionado con Inventario
│   └── users/               # Todo lo relacionado con Usuarios
│       ├── api/             # Llamadas al backend específicas de usuarios
│       ├── components/      # Componentes que SOLO se usan aquí (UserTable, UserForm)
│       ├── hooks/           # Lógica de negocio (useUsers, useCreateUser)
│       └── types/           # Interfaces de TS (IUser, IUserRole)
├── hooks/                   # Hooks globales (useTheme, useLocalStorage)
├── layouts/                 # Tus layouts (MainLayout, AuthLayout)
├── lib/                     # Configuraciones de librerías (axios, i18n, queryClient)
├── pages/                   # Las "vistas" finales que une el Router
│   ├── auth/
│   └── dashboard/
├── router/                  # Configuración de rutas (AppRouter, ProtectedRoute)
├── store/                   # Estado global (Zustand, Redux Toolkit)
├── types/                   # Tipos de TypeScript compartidos globalmente (APIResponse)
└── utils/                   # Funciones puras (formatearFecha, calcularImpuesto)