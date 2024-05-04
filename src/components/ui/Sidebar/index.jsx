import useAuth from '@/components/hooks/useAuth';
import { Button } from 'antd';
import { useEffect, useState } from 'react'
import {HouseFill, CartFill, PersonFill, ColumnsGap, BoxFill} from 'react-bootstrap-icons'
import toast from 'react-hot-toast';
import { NavLink, useLocation } from 'react-router-dom';

const Sidebar = ()=>{
    const [activeMenu, setActiveMenu] = useState('');


    const menus = [
        {
            id: 1,
            name: 'Dashboard',
            path: '/',
            icon: <HouseFill />
        },
        {
            id: 2,
            name: 'Products',
            path: '/products',
            icon: <BoxFill />
        },
        {
            id: 3,
            name: 'Category',
            path: '/category',
            icon: <ColumnsGap />
        },
        {
            id: 5,
            name: 'Orders',
            path: '/orders',
            icon: <CartFill />
        }
    ]

    const location = useLocation();

    useEffect(()=>{
        setActiveMenu(location.pathname);
    }, [location])

    const auth = useAuth();

    const handleLogout = async () => {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/admin/logout', {
            method: 'POST',
            credentials: 'include'
        })

        if(response.ok){
            auth.logout();
            return;
        }

        toast.error('Failed to logout');
    }

    return (
        <div>
            {/* Logo */}
            <div className='p-4 mb-4 border-b'><h1 className="text-2xl">Dashboard</h1></div>

            {/* Menus */}
            <div className='flex flex-col gap-2'>
                {
                    menus.map(item => {
                        return (
                            <NavLink to={item.path} key={item.id} className={`flex items-center gap-4 p-2 rounded-xl cursor-pointer ${item.path === activeMenu ? 'bg-white' : ''}`}>
                                <span className={`p-2 rounded-xl ${activeMenu == item.path ? 'text-white bg-primary' : 'text-primary bg-white'}`}>{item.icon}</span>
                                <span className='font-bold opacity-60'>{item.name}</span>
                            </NavLink>
                        )
                    })
                }

                <Button onClick={handleLogout} className='mt-10'>Logout</Button>
            </div>
        </div>
    )
}


export default Sidebar