import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import CommonLayout from "../components/layouts/CommonLayout";
import mainRoutes from "./mainRoutes";
import Login from "@/components/pages/Login";
import { AdminProvider } from "@/components/context/AdminContext";


const router = createBrowserRouter([
    {
        path: '/',
        element: <AdminProvider><CommonLayout /></AdminProvider>,
        children: [
            {
                path: '/',
                element: <MainLayout />,
                children: mainRoutes
            }
        ]
    },
    {
        path: 'login',
        element: <Login />
    }
])


export default router;