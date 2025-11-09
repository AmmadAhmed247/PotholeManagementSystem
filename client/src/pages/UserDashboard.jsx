import React, { useState } from 'react';
import { User, MapPin, Calendar, FileText, Image, Trash2, Edit, Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const [user] = useState({
    name: 'Ahmed Ali',
    email: 'ahmed@example.com',
    phone: '+92 300 1234567',
    joinDate: '2025-01-15'
  });

  const [complaints, setComplaints] = useState([
    {
      id: 1,
      location: 'Karachi, Sindh - Block 5, Gulshan',
      complaint: 'Street lights not working in our area for the past 2 weeks. This is causing safety issues for residents especially at night.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
      date: '2025-10-28',
      status: 'Pending'
    },
    {
      id: 2,
      location: 'Karachi, Sindh - Defence Phase 8',
      complaint: 'Large pothole on main road causing accidents. Multiple vehicles damaged. Urgent repair needed.',
      image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=400',
      date: '2025-10-25',
      status: 'In Progress'
    },
    {
      id: 3,
      location: 'Karachi, Sindh - Clifton Block 2',
      complaint: 'Water leakage from underground pipe. Road flooding causing traffic issues.',
      image: null,
      date: '2025-10-20',
      status: 'Resolved'
    },
    {
      id: 4,
      location: 'Karachi, Sindh - North Nazimabad',
      complaint: 'Broken traffic signal at main intersection. Creating dangerous situation for commuters.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
      date: '2025-10-18',
      status: 'Resolved'
    }
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <TrendingUp className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      setComplaints(complaints.filter(c => c.id !== id));
      setSelectedComplaint(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-500">Member since {user.joinDate}</p>
              </div>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl">
              <Plus className="w-5 h-5" />
              New Complaint
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total</p>
                <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
              </div>
              <FileText className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Pending</p>
                <p className="text-3xl font-bold text-gray-800">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">In Progress</p>
                <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Resolved</p>
                <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-500 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">My Complaints</h2>
            <p className="text-green-50 text-sm">Track and manage all your submitted complaints</p>
          </div>

          <div className="p-6">
            {complaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg font-semibold">No complaints yet</p>
                <p className="text-gray-400 text-sm mt-2">Start by creating your first complaint</p>
              </div>
            ) : (
              <div className="space-y-4">
                {complaints.map(complaint => (
                  <div 
                    key={complaint.id}
                    className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-500 transition cursor-pointer"
                    onClick={() => setSelectedComplaint(selectedComplaint?.id === complaint.id ? null : complaint)}
                  >
                    <div className="p-5 bg-white">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(complaint.status)}`}>
                              {getStatusIcon(complaint.status)}
                              {complaint.status}
                            </span>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="w-4 h-4 mr-1 text-green-500" />
                              {complaint.date}
                            </div>
                          </div>
                          <div className="flex items-start text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-1" />
                            <span className="font-semibold">{complaint.location}</span>
                          </div>
                          <p className="text-gray-600 ml-6 line-clamp-2">{complaint.complaint}</p>
                        </div>
                        {complaint.image && (
                          <img 
                            src={complaint.image} 
                            alt="Complaint" 
                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                          />
                        )}
                      </div>

                      {selectedComplaint?.id === complaint.id && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-100">
                          <div className="mb-4">
                            <label className="flex items-center text-gray-700 font-semibold text-sm mb-2">
                              <FileText className="w-4 h-4 mr-2 text-green-500" />
                              Full Complaint Details
                            </label>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                              {complaint.complaint}
                            </p>
                          </div>

                          {complaint.image && (
                            <div className="mb-4">
                              <label className="flex items-center text-gray-700 font-semibold text-sm mb-2">
                                <Image className="w-4 h-4 mr-2 text-green-500" />
                                Attached Image
                              </label>
                              <img 
                                src={complaint.image} 
                                alt="Complaint" 
                                className="w-full max-h-80 object-cover rounded-lg shadow-md"
                              />
                            </div>
                          )}

                          <div className="flex gap-3">
                            <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 font-semibold">
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(complaint.id);
                              }}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2 font-semibold"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}