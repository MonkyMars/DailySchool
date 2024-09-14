import styles from '/styles/Settings.module.css';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Nav from '/components/Nav';

const Settings = () => {
    const [user, setUser] = useState({
        email: '',
        password: '',
        school: '',
        grade: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/updateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                alert('Settings updated successfully');
            } else {
                alert('Failed to update settings');
            }
        } catch (err) {
            console.error('Error updating settings:', err);
            alert('An error occurred while updating settings');
        }
    };

    return (
        <>
            <Nav />
            <Head>
                <title>DailySchool | Settings</title>
            </Head>
            <main className={styles.Main}>
                <section className={styles.Section}>
                    <form onSubmit={handleSubmit}>
                        <h2>Update information</h2>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={user.email}
                            placeholder="Enter new email"
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={user.password}
                            placeholder="Enter new password"
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="school">School</label>
                        <input
                            id="school"
                            name="school"
                            type="text"
                            value={user.school}
                            placeholder="Enter new school"
                            onChange={handleInputChange}
                            required
                        />
                        <label htmlFor="grade">Grade</label>
                        <input
                            id="grade"
                            name="grade"
                            type="text"
                            value={user.grade}
                            placeholder="Enter new grade"
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit">Save Changes</button>
                    </form>
                </section>
            </main>
        </>
    );
};

export default Settings;
