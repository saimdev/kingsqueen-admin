import { useContext } from "react"
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";


const useAuth = () => {
    const {admin, setAdmin} = useContext(AdminContext);

    const navigate = useNavigate();

    const authenticate = ()=> {
        fetch(import.meta.env.VITE_API_BASE_URL + '/admin/authenticate', {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                console.log(response)
                if (response.ok) {
                    return response.json();
                }else{
                    setAdmin({data: null, loading: false});
                }
            })
            .then(result => {
                if (result) {
                    setAdmin({data: result.data, loading: false});
                }
            })
            .catch(error => {
                console.log('Unauthorized');
                setAdmin({data: null, loading: false});
            })
    }

    const isAuthenticated = () => {
        return admin.data ? true : false;
    }

    const login = (admin) => {
        setAdmin({data: admin, loading: false});
    }

    const logout = () => {
        setAdmin({data: null, loading: true});
    }

    return {authenticate, isAuthenticated, login, logout, admin, setAdmin}
}

export default useAuth