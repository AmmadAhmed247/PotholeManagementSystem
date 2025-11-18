import React, { useState } from 'react';
import axios from 'axios';
import { Upload, MapPin, Mail, Phone, CreditCard, User, FileText } from 'lucide-react';

export default function ComplaintForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    location: '',
    chairman: '',
    complaint: '',
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const payload = {
      title: formData.name,
      description: formData.complaint,
      location: formData.location,
      area: formData.chairman || '',
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to submit a complaint.');
      return;
    }

    await axios.post('http://localhost:5000/api/complaint', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        cnic: '',
        location: '',
        chairman: '',
        complaint: '',
        image: null
      });
      setImagePreview(null);
    }, 3000);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || 'Submission failed');
  }
};



  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Complaint Submitted!</h2>
          <p className="text-gray-600">Thank you for your submission. We will review your complaint shortly.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-green-500 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Submit a Complaint</h1>
            <p className="text-green-50 mt-2">Please fill out the form below with your details</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && <p className="text-red-500">{error}</p>}

            {/* Full Name */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <User className="w-4 h-4 mr-2 text-green-500" /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Mail className="w-4 h-4 mr-2 text-green-500" /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Phone className="w-4 h-4 mr-2 text-green-500" /> Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="+92 300 1234567"
              />
            </div>

            {/* CNIC */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <CreditCard className="w-4 h-4 mr-2 text-green-500" /> CNIC (Optional)
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="12345-1234567-1"
              />
            </div>

            {/* Location */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <MapPin className="w-4 h-4 mr-2 text-green-500" /> Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter location address"
              />
            </div>

            {/* Chairman */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <User className="w-4 h-4 mr-2 text-green-500" /> Chairman (Optional)
              </label>
              <input
                type="text"
                name="chairman"
                value={formData.chairman}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition"
                placeholder="Enter chairman name"
              />
            </div>

            {/* Complaint Details */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <FileText className="w-4 h-4 mr-2 text-green-500" /> Complaint Details *
              </label>
              <textarea
                name="complaint"
                value={formData.complaint}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none transition resize-none"
                placeholder="Describe your complaint in detail..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="flex items-center text-gray-700 font-semibold mb-2">
                <Upload className="w-4 h-4 mr-2 text-green-500" /> Upload Image (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="imageUpload"
                />
                <label htmlFor="imageUpload" className="cursor-pointer">
                  {imagePreview ? (
                    <div>
                      <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg mb-2" />
                      <p className="text-sm text-green-600">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">Click to upload an image</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 shadow-lg"
            >
              Submit Complaint
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
