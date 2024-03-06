import {db} from "../firebase/config";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut
} from "firebase/auth";
import {useState, useEffect} from "react";

export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    //cleanup
    //deal with memory leak
    const [cancelled, setCancelled] = useState(false);
    
    const auth = getAuth();

    function checkIfCancelled() {
        if (cancelled) {
            return;
        }
    }

    const createUser = async (data) => {
        checkIfCancelled();
        setLoading(true);
        setError(null);
    
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            await updateProfile(user, {displayName: data.displayName});
            setLoading(false);
            return user;
        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);
            let systemErrorMessages;

            if(error.message.includes("Password")){
                systemErrorMessages = "Senha precisa ter no mínimo 6 caracteres";
            } else if(error.message.includes("email-already")){
                systemErrorMessages = "Email já cadastrado";
            }else {
                systemErrorMessages = "Erro ao criar usuário";
            }

            setLoading(false);
            setError(systemErrorMessages);
        }
    };

    useEffect(() => {
        return () => {
            setCancelled(true);
        }
    }, [])

    return {
        auth,
        createUser,
        error,
        loading,
    }
}