import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Mail, Phone, CreditCard, User, Calendar, FileText, AlertCircle, CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';

export default function MNADashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // ✅ Fetch all complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/complaints/status");
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch (err) {
        console.error("Error fetching complaints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  // ✅ Update complaint status (send PUT to backend)
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/complaint/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id, status: newStatus }),
      });
      
      if (res.ok) {
        setComplaints(complaints.map(c => 
          c.id === id ? { ...c, status: newStatus } : c
        ));
        if (selectedComplaint?.id === id) {
          setSelectedComplaint({ ...selectedComplaint, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.complaintDetails?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || complaint.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || complaint.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Resolved': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Low': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 mx-auto text-green-500 mb-4 animate-spin" />
          <p className="text-gray-600 text-lg">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">MNA Dashboard</h1>
              <p className="text-green-50 mt-1">Constituency: NA-245 (Karachi)</p>
            </div>
            <div className="text-right">
              <div className="text-white text-sm">Logged in as</div>
              <div className="text-white font-semibold">Hon. Member of National Assembly</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Complaints</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, location, or complaint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
              >
                <option>All</option>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            <div className="relative">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition appearance-none bg-white cursor-pointer"
              >
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mt-4">
            Showing {filteredComplaints.length} of {complaints.length} complaints
          </div>
        </div>

        {/* Complaints List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Complaints List</h2>
            {filteredComplaints.map(complaint => (
              <div 
                key={complaint.id} 
                onClick={() => setSelectedComplaint(complaint)}
                className={`bg-white rounded-xl shadow-md p-5 cursor-pointer border-2 transition-all hover:shadow-lg ${
                  selectedComplaint?.id === complaint.id ? 'border-green-500' : 'border-transparent'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{complaint.fullName}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    {complaint.priority && (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-start text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="line-clamp-1">{complaint.location}</span>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                  {complaint.complaintDetails}
                </p>
              </div>
            ))}

            {filteredComplaints.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No complaints found</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* Complaint Details Panel */}
          <div className="sticky top-6">
            {selectedComplaint ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Complaint Details</h2>
                
                <div className="space-y-6">
                  {/* Citizen Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Citizen Information</h3>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium text-gray-700 w-24">Name:</span>
                        <span className="text-gray-900">{selectedComplaint.fullName}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium text-gray-700 w-24">Email:</span>
                        <span className="text-gray-900">{selectedComplaint.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium text-gray-700 w-24">Phone:</span>
                        <span className="text-gray-900">{selectedComplaint.phone}</span>
                      </div>
                      {selectedComplaint.cnic && (
                        <div className="flex items-center text-sm">
                          <CreditCard className="w-4 h-4 mr-2 text-green-500" />
                          <span className="font-medium text-gray-700 w-24">CNIC:</span>
                          <span className="text-gray-900">{selectedComplaint.cnic}</span>
                        </div>
                      )}
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium text-gray-700 w-24">Location:</span>
                        <span className="text-gray-900">{selectedComplaint.location}</span>
                      </div>
                      {selectedComplaint.chairman && (
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 mr-2 text-green-500" />
                          <span className="font-medium text-gray-700 w-24">Chairman:</span>
                          <span className="text-gray-900">{selectedComplaint.chairman}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Complaint Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Complaint Description</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                      {selectedComplaint.complaintDetails}
                    </p>
                  </div>

                  {/* Image */}
                  {selectedComplaint.image && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Attached Evidence</h3>
                      <img 
                        src={selectedComplaint.image} 
                        alt="Complaint" 
                        className="w-full rounded-lg object-cover max-h-64 shadow-md"
                      />
                    </div>
                  )}

                  {/* Status Update */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => updateStatus(selectedComplaint.id, 'Pending')}
                        disabled={selectedComplaint.status === 'Pending'}
                        className="w-full py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-500 hover:bg-yellow-600 text-white"
                      >
                        Mark as Pending
                      </button>
                      <button
                        onClick={() => updateStatus(selectedComplaint.id, 'In Progress')}
                        disabled={selectedComplaint.status === 'In Progress'}
                        className="w-full py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Mark as In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(selectedComplaint.id, 'Resolved')}
                        disabled={selectedComplaint.status === 'Resolved'}
                        className="w-full py-3 px-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600 text-white"
                      >
                        Mark as Resolved
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center pt-4 border-t">
                    ID: #{selectedComplaint.id} • Submitted on {new Date(selectedComplaint.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">Select a complaint to view details</p>
                <p className="text-gray-400 text-sm mt-2">Click on any complaint from the list</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}