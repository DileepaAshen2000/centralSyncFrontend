import React, { useState } from 'react';
import axios from 'axios';
import emailImage from '../../assests/emailConfirm.jpg';
import { TextField } from '@mui/material';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [message, setMessage] = useState('');

    const validateEmail = (email) => {
        // Basic regex for email validation
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (emailError) {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        try {
            const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
            setMessage(response.data);
            setEmailError('');
            Swal.fire({
                title: "Successfully Verified!",
                text: "Please Check Your Email.!!",
                icon: "success"
            });
        } catch (error) {
            setEmailError(error.response?.data?.message || 'Failed to send email');
            console.log(error);
            Swal.fire({
                title: "Couldn't Verified.!",
                text: "Please Check Your Email Address.!!",
                icon: "error"
            });
        }
    };

    return (
        <div className='flex w-full h-screen'>
            <div className='grid grid-cols-1 m-auto md:grid-cols-2 h-[500px] shadow-lg shadow-gray-600 sm:max-w-[900px]'>
                <div className='hidden m-auto md:block'>
                    <img className='w-full' src={emailImage} alt="/" />
                </div>
                <div className='flex flex-col gap-6 p-12 bg-blue-300'>
                    <div className='flex justify-center mb-10 text-xl font-semibold'>
                        <h1>Verify your email address</h1>
                    </div>
                    <div className='mb-12 text-sm'>
                        <p>Enter your email Address and, we'll send you a link to reset your password.</p>
                    </div>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                        <p>Email Address :</p>
                        <div className='flex flex-col gap-10'>
                            <TextField
                                id="outlined-basic"
                                label="Email Address"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={handleChange}
                                error={!!emailError}
                                helperText={emailError}
                                required
                            />
                            <button type="submit" className="bg-blue-600 py-2 text-white rounded w-[auto]">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
