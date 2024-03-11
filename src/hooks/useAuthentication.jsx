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

    //logout - sign out
    const logout = async () => {
        checkIfCancelled();
        setLoading(true);
        setError(null);
        try {
            await signOut(auth);
            setLoading(false);
        } catch (error) {
            console.log(error.message);
            setLoading(false);
            setError("Erro ao sair da conta");
        }
    };

    //login - sign in
    const login = async (data) => {
        checkIfCancelled();
        setLoading(true);
        setError(null);
        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
            setLoading(false);
            return user;
        } catch (error) {
            let systemErrorMessages
            if (error.message.includes("user-not-found")){
                systemErrorMessages = "Usuario não encontrado";
                
            } else if(error.message.includes("wrong-password") || error.message.includes("INVALID_LOGIN_CREDENTIALS")){
                systemErrorMessages = "Usuario/senha inválida";
            }else if(error.message == 'Firebase: Error (auth/invalid-credential).'){
                systemErrorMessages = "Usuario/senha inválida";
            }else{
                systemErrorMessages = "Erro ao logar";
            }

            console.log(error.message);
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
        logout,
        login,
    }
}