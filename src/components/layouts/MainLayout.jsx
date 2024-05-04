import { Outlet } from "react-router-dom"
import {Sidebar, Navbar, Footer} from '@/components/ui'


const MainLayout = () => {
  return (
    <>
      <div className="flex">
      {/* Sidebar */}
      <div className="border-r h-svh w-[300px] px-10 py-4">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="w-full">
        <Navbar />
        <div className="p-4">
          <Outlet />
        </div>

      </div>
    </div>
    </>
  )
}

export default MainLayout