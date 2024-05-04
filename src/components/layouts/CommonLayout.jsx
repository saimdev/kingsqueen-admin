import { Outlet, useNavigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import useAuth from "../hooks/useAuth"


const CommonLayout = () => {
  const {authenticate} = useAuth();
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    auth.authenticate();
  }, [auth.admin.loading]);

  if(auth.admin.loading) return <div>Loading...</div>;

  if(auth.admin.data == null) return navigate('/login');

  return (
    <>
      <Toaster />
      <Outlet />
    </>
  )
}

export default CommonLayout