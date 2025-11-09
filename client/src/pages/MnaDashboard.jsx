import React, { useState } from 'react';
import { Search, Filter, MapPin, Mail, Phone, CreditCard, User, Calendar, FileText, AlertCircle, CheckCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';

export default function MNADashboard() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      name: 'Ahmed Ali',
      email: 'ahmed@example.com',
      phone: '+92 300 1234567',
      cnic: '42101-1234567-1',
      location: 'Karachi, Sindh - Gulshan-e-Iqbal',
      constituency: 'NA-245',
      complaint: 'Street lights not working in our area for the past 2 weeks. This is causing safety issues for residents especially women and children.',
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400',
      date: '2025-10-28',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: 2,
      name: 'Fatima Khan',
      email: 'fatima@example.com',
      phone: '+92 321 9876543',
      cnic: '42201-7654321-2',
      location: 'Karachi, Sindh - Korangi',
      constituency: 'NA-245',
      complaint: 'Garbage collection not done regularly. Waste is piling up and creating health hazards in our neighborhood.',
      image: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
      date: '2025-10-27',
      status: 'In Progress',
      priority: 'Medium'
    },
    {
      id: 3,
      name: 'Ali Raza',
      email: 'ali@example.com',
      phone: '+92 333 5551234',
      cnic: '42301-9876543-3',
      location: 'Karachi, Sindh - Malir',
      constituency: 'NA-245',
      complaint: 'Water supply issues in our area. No water for 3 days straight. Community is facing severe difficulties.',
      image: null,
      date: '2025-10-26',
      status: 'Resolved',
      priority: 'High'
    },
    {
      id: 4,
      name: 'Sara Ahmed',
      email: 'sara@example.com',
      phone: '+92 301 4447777',
      cnic: '42401-3456789-4',
      location: 'Karachi, Sindh - Landhi',
      constituency: 'NA-245',
      complaint: 'Road damaged with multiple potholes causing accidents. Several vehicles damaged. Urgent repair needed.',
      image: 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=400',
      date: '2025-10-25',
      status: 'Pending',
      priority: 'High'
    },
    {
      id: 5,
      name: 'Hassan Mahmood',
      email: 'hassan@example.com',
      phone: '+92 315 8889999',
      cnic: '42501-1112223-5',
      location: 'Karachi, Sindh - Gulistan-e-Johar',
      constituency: 'NA-245',
      complaint: 'Drainage system blocked causing flooding during rain. Water enters homes causing property damage.',
      image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
      date: '2025-10-24',
      status: 'In Progress',
      priority: 'High'
    },
    {
      id: 6,
      name: 'Ayesha Siddiqui',
      email: 'ayesha@example.com',
      phone: '+92 322 3334444',
      cnic: '42601-5556667-6',
      location: 'Karachi, Sindh - Shah Faisal',
      constituency: 'NA-245',
      complaint: 'Public park in poor condition. Children have no safe place to play. Equipment broken and dangerous.',
      image: null,
      date: '2025-10-23',
      status: 'Pending',
      priority: 'Low'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const updateStatus = (id, newStatus) => {
    setComplaints(complaints.map(c => 
      c.id === id ? { ...c, status: newStatus } : c
    ));
    if (selectedComplaint?.id === id) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.complaint.toLowerCase().includes(searchTerm.toLowerCase());
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
                    <h3 className="text-lg font-bold text-gray-900">{complaint.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {complaint.date}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-start text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                  <span className="line-clamp-1">{complaint.location}</span>
                </div>

                <p className="text-sm text-gray-700 line-clamp-2 bg-gray-50 p-3 rounded-lg">
                  {complaint.complaint}
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
                        <span className="text-gray-900">{selectedComplaint.name}</span>
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
                      <div className="flex items-center text-sm">
                        <CreditCard className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium text-gray-700 w-24">CNIC:</span>
                        <span className="text-gray-900">{selectedComplaint.cnic}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-green-500" />
                        <span className="font-medium text-gray-700 w-24">Location:</span>
                        <span className="text-gray-900">{selectedComplaint.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Complaint Details */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Complaint Description</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg text-sm leading-relaxed">
                      {selectedComplaint.complaint}
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
                    ID: #{selectedComplaint.id} • Submitted on {selectedComplaint.date}
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