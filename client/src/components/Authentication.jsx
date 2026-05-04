import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AuthPages({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {

      console.log("HANDLE SUBMIT RUNNING");


    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        if (!formData.email || !formData.password) return alert('Fill all fields');

        const res = await axios.post('http://localhost:5000/api/auth/login', {
          email: formData.email,
          password: formData.password
        });

        console.log("FULL RESPONSE:", res.data);
        // console.log("ROLE:", role);
        // console.log("TYPE:", typeof role);

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));

        const role = res.data.user?.role;

        console.log(role)

        if (role === 'admin') {
          navigate('/admindashboard');
        } else {
          navigate('/usercomplaints');
        }
      } else {
        // --- SIGNUP LOGIC ---
        if (!formData.name || !formData.email || !formData.password) return alert('Fill all fields');
        if (formData.password !== formData.confirmPassword) return alert('Passwords mismatch');

        await axios.post('http://localhost:5000/api/auth/signup', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        alert('Account created! Please login.');
        setIsLogin(true); // Switch to login mode
      }
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred');
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Close Button Fix */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-20"
          >
            <X size={24} />
          </button>

          <div className="bg-green-500 px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
          </div>

          <div className="p-8">
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="flex items-center text-gray-600 text-sm font-semibold mb-1">
                    <User className="w-4 h-4 mr-2" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className="flex items-center text-gray-600 text-sm font-semibold mb-1">
                  <Mail className="w-4 h-4 mr-2" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="name@email.com"
                />
              </div>

              <div>
                <label className="flex items-center text-gray-600 text-sm font-semibold mb-1">
                  <Lock className="w-4 h-4 mr-2" /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="flex items-center text-gray-600 text-sm font-semibold mb-1">
                    <Lock className="w-4 h-4 mr-2" /> Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              )}

              <button
                type='button'
                onClick={handleSubmit}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 mt-4"
              >
                {isLogin ? 'Login' : 'Sign Up'}
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-500 text-sm">
                  {isLogin ? "New here?" : "Joined us before?"}
                  <button
                    onClick={toggleAuthMode}
                    className="text-green-600 font-bold ml-1 hover:underline"
                  >
                    {isLogin ? 'Create an account' : 'Login now'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}