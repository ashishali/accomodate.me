import React, { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = ({ onLogin }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const { name, email, password } = formData;

        if (!email.trim() || !password.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        const users = JSON.parse(localStorage.getItem('accomodate_users_db') || '[]');

        if (isSignUp) {
            // Sign Up Logic
            if (!name.trim()) {
                setError('Name is required for sign up.');
                return;
            }

            const existingUser = users.find(u => u.email === email.trim());
            if (existingUser) {
                setError('User with this email already exists.');
                return;
            }

            const newUser = {
                id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: name.trim(),
                email: email.trim(),
                password: password // In a real app, never store plain text passwords!
            };

            users.push(newUser);
            localStorage.setItem('accomodate_users_db', JSON.stringify(users));

            // Auto login
            onLogin({ id: newUser.id, name: newUser.name, email: newUser.email });

        } else {
            // Sign In Logic
            const user = users.find(u => u.email === email.trim() && u.password === password);
            if (user) {
                onLogin({ id: user.id, name: user.name, email: user.email });
            } else {
                setError('Invalid email or password.');
            }
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1e1e2e 0%, #11111b 100%)',
            zIndex: 9999
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    padding: '40px',
                    width: '100%',
                    maxWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px'
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '32px', background: 'linear-gradient(45deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Accomodate.me
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
                        {isSignUp ? 'Create an account to list your space' : 'Welcome back!'}
                    </p>
                </div>

                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
                    <button
                        onClick={() => { setIsSignUp(false); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: !isSignUp ? 'var(--glass-bg)' : 'transparent',
                            color: !isSignUp ? 'white' : 'var(--color-text-muted)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => { setIsSignUp(true); setError(''); }}
                        style={{
                            flex: 1,
                            padding: '8px',
                            background: isSignUp ? 'var(--glass-bg)' : 'transparent',
                            color: isSignUp ? 'white' : 'var(--color-text-muted)',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {isSignUp && (
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-main)' }}>
                            Full Name
                            <input
                                type="text"
                                required={isSignUp}
                                placeholder="Alex Smith"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                        </label>
                    )}

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-main)' }}>
                        Email Address
                        <input
                            type="email"
                            required
                            placeholder="alex@example.com"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </label>

                    <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-main)' }}>
                        Password
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                    </label>

                    {error && (
                        <div style={{ color: '#fca5a5', fontSize: '13px', textAlign: 'center', background: 'rgba(252, 165, 165, 0.1)', padding: '8px', borderRadius: '4px' }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        style={{
                            marginTop: '8px',
                            padding: '12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--color-primary)',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '16px',
                            transition: 'transform 0.1s'
                        }}
                    >
                        {isSignUp ? 'Create Account' : 'Sign In'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
