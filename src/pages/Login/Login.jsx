import React from 'react'
import styles from './Login.module.css'
import { useEffect, useState } from "react";
import { useAuthentication } from "../../hooks/useAuthentication";


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { error: authError, loading, login } = useAuthentication();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        setError("");
    
        const user = {
            email,
            password,
        };
    
        await login(user);
    };

    useEffect(() => {
        if (authError) {
            setError(authError);
        }
    }, [authError]);

    return (
        <div className={styles.login}>
            <h1>Entrar</h1>
            <p>Faça o login para utilizar o sistema</p>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Email</span>
                    <input
                        type="email"
                        name='email'
                        required
                        placeholder='Email do usuário'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                <label>
                    <span>Senha</span>
                    <input
                        type="password"
                        name='password'
                        required
                        placeholder='Senha do usuário'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>

                {!loading && <button className='btn' type='submit'>Entrar</button>}
                {loading && <button className='btn' type='submit' disabled>Cadastrando...</button>}
                {error && <p className='error'>{error}</p>}
            </form>
        </div>
    )
}

export default Login