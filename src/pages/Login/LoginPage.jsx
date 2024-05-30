import React, { useState } from 'react';
import inventory from '../../assests/inventory.jpg';
import LoginService from '../../pages/Login/LoginService';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await LoginService.login(email, password);
      console.log(userData);
      if (userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('role', userData.role);
        // navigate('');
      } else {
        setError(userData.message);
      }
    } catch (error) {
      console.log(error);
      setError(error.message);
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  return (<div className='flex w-full h-screen'>
  <div className='grid grid-cols-1 m-auto md:grid-cols-2 h-[500px] shadow-lg shadow-gray-600 sm:max-w-[900px]'>

    <div className='hidden mt-[100px] md:block'>
      <img className='w-full ' src={inventory} alt="/" />
    </div>
      
    <div className='flex flex-col justify-around p-16 bg-blue-300'>
      <form onSubmit={handleSubmit}>
          <h1 className='text-4xl font-bold text-center mb-14'>Login</h1>
          {error && <p className="error-message">{error}</p>}
          <h4 className='mb-8'>Please enter your login details to sign in.</h4>
          <div className='flex flex-col gap-2'>
            <input className='p-2 border ' type="email" value={email}onChange={(e) => setEmail(e.target.value)}placeholder='User email' />
            <input className='p-2 border' type="password"value={password} onChange={(e) => setPassword(e.target.value)}placeholder='Password' />
          </div>
          
          <button className='w-full py-2 my-4 text-white bg-blue-600 hover:bg-blue-500'type="submit">Login</button>
          <p className='text-center'>Forgot Username or Password ?</p>
      </form>
    </div>
  </div>
</div>
)
}
