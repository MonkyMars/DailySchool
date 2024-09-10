import React, { useState } from "react";
import Nav from '/components/Nav';
import styles from '/styles/Login.module.css';

export default function Login() {
    const [formType, setFormType] = useState('login');
    const [error, setError] = useState('');
    const Schools = [
        'Christelijk Lyceum Delft',
        'GSR Rijswijk'
    ];
    const Grades = [
        'H4a',
        'H4b',
    ]
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        school: '',
        grade: '',
        role: 'student',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Email and Password are required');
            return false;
        }
        if (formType === 'signup' && (!formData.school || !formData.grade)) {
            setError('School and Grade are required for sign up');
            return false;
        }
        return true;
    };

    const submitSignUp = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch('/api/addUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('user', JSON.stringify(data.user));
              window.location.href = '/overview';
            } else {
              setError('Failed to sign up. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during sign up.');
        }
    };

    const submitLogin = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch('/api/loginUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
              const data = await response.json();
              localStorage.setItem('user', JSON.stringify(data.user));
              window.location.href = '/overview';
            } else {
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred during login.');
        }
    };

    return (
        <>
            <Nav page='login'/>
            <form 
                className={styles.LoginForm} 
                onSubmit={formData && formType === 'login' ? submitLogin : submitSignUp}
            >
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
                        required
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        placeholder="Enter password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        required
                    />
                    {formType === 'signup' && (
                        <>
                            <label htmlFor="school">{'School'}</label>
                            <input 
                                type="text" 
                                id="school" 
                                name="school" 
                                placeholder="Enter school" 
                                list="schools" 
                                value={formData.school} 
                                onChange={handleInputChange} 
                                required
                            />
                            <label htmlFor="class">{'Grade'}</label>
                            <input 
                                type="text" 
                                id="grade" 
                                name="grade" 
                                placeholder="Enter grade" 
                                list="grades" 
                                value={formData.grade} 
                                onChange={handleInputChange} 
                                required
                            />
                            <datalist id="schools">
                                {Schools.map((School, index) => (
                                    <option value={School} key={index} />
                                ))}
                            </datalist>
                            <datalist id='grades'>
                                {Grades.map((Grade, index) => (
                                    <option value={Grade} key={index} />
                                ))}
                            </datalist>
                        </>
                    )}
                </div>
                <button type="submit">Submit</button>
                {formType === 'login' && <a href="/forgotpassword">Forgot password?</a>}
                <a 
                    href="#" 
                    onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
                >
                    {formType === 'login' ? "Don't have an account?" : 'Already have an account?'}
                </a>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </>
    );
}
