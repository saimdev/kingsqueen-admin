import Login from "@/components/pages/Login";
import { Category, Customers, Dashboard, Orders, Products } from "../components/pages";


const mainRoutes = [
    {
        path: '/',
        element: <Dashboard />
    },
    {
        path: '/products',
        element: <Products />
    },
    {
        path: '/category',
        element: <Category />
    },
    {
        path: '/customers',
        element: <Customers />
    },
    {
        path: '/orders',
        element: <Orders />
    }
]


export default mainRoutes;