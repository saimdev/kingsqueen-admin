import { Button, Input } from "@chakra-ui/react"


const Login = () => {

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)

        const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        })

        if(response.ok) {
            window.location.href = '/';
        }
    }

    return (
        <div className="flex justify-center items-center pt-20">
            <form method="POST" onSubmit={handleSubmit} className="w-[400px] shadow-md p-10 rounded-lg">
                <div>
                    <label htmlFor="email">Email</label>
                    <Input type='text' name="email" id="email" />
                </div>

                <div className="mt-2">
                    <label htmlFor="password">Password</label>
                    <Input type='password' name="password" id="password" />
                </div>
                
                <Button type="submit" colorScheme="blue" className="mt-6 w-full">Login</Button>
            </form>
        </div>
    )
}

export default Login