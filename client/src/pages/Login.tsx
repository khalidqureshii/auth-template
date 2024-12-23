import React, { useState } from "react";
import InputEntry from "../components/InputEntry";
import {useAuth} from "../store/Auth"
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import LINK from "../store/Link";
import Loader from "../components/Loader";
import InputEntryPassword from "../components/InputEntryPassword"
import TOKENNAME from "../store/Token";

function Login() {
    const navigate = useNavigate();
    const currToken = localStorage.getItem(TOKENNAME);
    const [user,setUser] = useState({email: "", password: ""});
    const {storeTokenInLS} = useAuth();

    const [isLoading, setLoading] = useState(false);
    
    React.useEffect(() => {
        if (currToken) {
            navigate("/home"); 
        }
    }, [currToken, navigate]);

    function updateUser(event: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setUser(prevUser => { 
            const updatedUser = {
                ...prevUser,
                [name]: value,
            }
            return updatedUser;
        });
    }
    
    async function storeData() {
        setLoading(true);
        const response = await fetch(LINK + "api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }); 
        setLoading(false);
        if (response.ok) {
            toast("Successfully Logged in");
            const resp_data = await response.json();
            await storeTokenInLS(resp_data.token);
            navigate("/home");
        }
        else {
            const res_data = await response.json();
            toast(res_data.message);
        }
    }

    if (isLoading) return <Loader />;

    return <div className="w-full h-90vh flex flex-row justify-center items-center">
        <div className="mx-5">
            <div className="flex flex-row justify-center items-center bg-credbg rounded-3xl overflow-hidden shadow-3xl flex-wrap custom:py-0 py-10">
                <img src="group.png" style={{ width: "30rem", height: "auto", objectFit: "contain" }} className="hidden custom:block"/>
                <div className="flex flex-col justify-center items-center mx-12">
                    <img src="logo.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                    <h1 className="mb-10 text-5xl text-black text-center font-logo font-bold">[Enter Name]</h1>
                    <InputEntry changeFunction={updateUser} name="email" text="Email" placeholder="Email" />
                    <InputEntryPassword changeFunction={updateUser} name="password" text="Password" placeholder="Password"/>
                    <button className="bg-blue-600 hover:bg-blue-500 py-2 px-4 rounded-lg text-white mt-3 mb-2 shadow-lg" type="submit" onClick={storeData}>Log in</button>
                    <h2 className="text-lg text-black mt-3">Don't have an Account? <span className="text-blue-500 cursor-pointer" onClick={()=>navigate("/register")}>Sign up</span></h2>
                </div>
            </div>
        </div>
    </div>
}   

export default Login;