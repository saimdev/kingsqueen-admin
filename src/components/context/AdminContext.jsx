import { createContext, useState } from "react";

const AdminContext = createContext(null);

const AdminProvider = ({ children }) => {
    const [admin, setAdmin] = useState({
        data: null,
        loading: true
    });

    return (
        <AdminContext.Provider value={{admin, setAdmin}}>
            {children}
        </AdminContext.Provider>
    )
}

export { AdminContext, AdminProvider }