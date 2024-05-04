import useAuth from '@/components/hooks/useAuth';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { Button, Dropdown } from 'antd';
import { PersonFill, GearFill, BellFill } from 'react-bootstrap-icons'
import { useLocation } from 'react-router-dom'


const Navbar = () => {
    const location = useLocation();
    const auth = useAuth();
    console.log(auth.admin)
    const settingsMenu = [
        {
            key: '1',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    1st menu item
                </a>
            ),
        },
    ]

    return (
        <div className='flex justify-between items-center w-full px-4 py-6'>
            {/* left Side */}
            <div>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Home</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem isCurrentPage>
                        <BreadcrumbLink href='#'>{location.pathname.replace('/', '')}</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </div>

            {/* Right Side */}
            <div className='flex gap-2 items-center mr-8'>
                <p><strong>Welcome, </strong>{auth.admin.data.email}</p>
            </div>
        </div>
    )
}


export default Navbar;