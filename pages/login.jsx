import React, { useEffect, useState } from "react";
import Nav from '/components/Nav';
import styles from '/styles/Login.module.css';

export default function Login() {
    const [formType, setFormType] = useState('login');
    const [error, setError] = useState('');
    const schools = [
        'Christelijk Lyceum Delft',
        'GSR Rijswijk'
    ];

    const [formData, setFormData] = useState({
        id: '',
        email: '',
        password: '',
        school: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const submitSignUp = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch('/api/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            if(response.ok) {
                window.location.href = '/overview';
            } else {
                setError('Invalid credentials')
            }
        } catch(err){
            console.error(err);
        }
    }

    const submitLogin = async(e) => {
        e.preventDefault();
        try{
            const response = await fetch('/api/loginUser', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if(response.ok) {
                window.location.href = '/overview';
            } else {
                setError('Invalid credentials')
            }
        } catch(err){
            console.error(err);
        }
    }
    return (
        <>
            <Nav />
            <form className={styles.LoginForm} onSubmit={formData && formType === 'login' ? submitLogin : submitSignUp}>
                <h2>{formType === 'login' ? 'Log in' : 'Sign up'}</h2>
                <div>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter Email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Enter password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                    />
                    {formType === 'signup' && <>
                    <label htmlFor="school">{'School'}</label>
                    <input 
                        type="text" 
                        id="school" 
                        name="school" 
                        placeholder="Enter school" 
                        list="schools" 
                        value={formData.school} 
                        onChange={handleInputChange} 
                    />
                    <datalist id="schools">
                        {schools.map((school, index) => (
                            <option value={school} key={index} />
                        ))}
                    </datalist>
                </>}
                </div>
                <button type="submit">Submit</button>
                {formType === 'login' && <a href="/forgotpassword">Forgot password?</a>}
                <a onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}>{formType === 'login' ? "Don't have an account?" : 'Already have an account?'}</a>
                {error}
            </form>
        </>
    );
}
