import React, { useState } from "react";
import InputEntry from "../components/InputEntry";
import useAuth from "../store/Auth";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import LINK from "../store/Link";
import InputEntryPassword from "../components/InputEntryPassword";
import Loader from "../components/Loader";
import TOKENNAME from "../store/Token";

function Register() {
    const navigate = useNavigate();
    const currToken = localStorage.getItem(TOKENNAME);
    const {storeTokenInLS}  = useAuth();
    const [user,setUser] = useState({username: "", email: "", phone: "", password: "", confirmPassword: "", match: true});
    const [isLoading, setLoading] = useState(false);

    React.useEffect(() => {
        if (currToken) {
            navigate("/home"); 
        }
    }, [currToken, navigate]);

    function updateUser(event: React.ChangeEvent<HTMLElement>) {
        const { name, value } = event.target as HTMLInputElement;
        setUser(prevUser => { 
            const updatedUser = {
                ...prevUser,
                [name]: value,
            }
            updatedUser.match = (updatedUser.password == updatedUser.confirmPassword);
            return updatedUser;
        });
    }

    async function storeData() {
        if (!user.match) return;
        setLoading(true);
        const response = await fetch(LINK + "api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        }); 
        setLoading(false);
        if (response.ok) {
            toast("Successfully Registered");
            const resp_data = await response.json();
            storeTokenInLS(resp_data.token);
            navigate("/home");
        }
        else {
            const res_data = await response.json();
            toast(res_data.message);
        }
    }

    if (isLoading) return <Loader />;

    return <div className="w-full h-90vh flex items-center justify-center">
        <div className="flex bg-credbg rounded-3xl overflow-hidden shadow-3xl mx-5 flex-wrap custom:py-0 py-10">
            <img src="group2.png" style={{ width: "35rem", height: "auto", objectFit: "contain" }} className="hidden custom:block"/>
            <div className="flex flex-col justify-center items-center text-center mx-20">
                <img src="logo.png" style={{ width: "3rem", height: "auto", objectFit: "contain" }} />
                <h1 className="text-5xl mb-10 text-black font-logo font-bold">[Enter Name]</h1>
                <InputEntry changeFunction={updateUser} name="username" text="Username" placeholder="Username" value={user.username} /> 
                <InputEntry changeFunction={updateUser} name="email" text="Email" placeholder="Email" value={user.email} />
                <InputEntryPassword changeFunction={updateUser} name="password" text="Password" placeholder="Password" value={user.password} />
                <InputEntryPassword changeFunction={updateUser} name="confirmPassword" text="Confirm Password" placeholder="Confirm Password" value={user.confirmPassword} />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white rounded-lg py-2 px-4 mt-3 shadow-lg" onClick={storeData}>Sign up</button>

                <h2 className="text-lg mt-5 text-black">Already have an Account? <span className="text-blue-500 cursor-pointer" onClick={()=>navigate("/login")}>Log in</span></h2>
            </div>
        </div>
    </div>
}   

export default Register;