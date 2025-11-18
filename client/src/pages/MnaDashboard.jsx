import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle, TrendingUp, Plus, Layers, RefreshCw, X, CheckCircle, Clock, Undo, Redo } from 'lucide-react';

const ComplaintMap = () => {
  const [complaints, setComplaints] = useState([]);
  const [areas, setAreas] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [traversalMode, setTraversalMode] = useState('bfs');
  const [sortMode, setSortMode] = useState('priority'); // 'priority' or 'default'
  const [clusterData, setClusterData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({ 
    area: '', 
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    location: '',
    complaintDetails: '',
    priority: 'Low'
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Helper to attach Authorization header when token exists
  const getAuthHeaders = (withJson = true) => {
    const token = localStorage.getItem('token');
    const base = {};
    if (withJson) base['Content-Type'] = 'application/json';
    if (token) base['Authorization'] = `Bearer ${token}`;
    return base;
  };

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/complaints/status", { headers: getAuthHeaders(false) });
      const data = await res.json();
      const complaintsData = data.complaints || [];
      setComplaints(complaintsData);
      console.log(complaintsData);
      
      
      const locationMap = {};
      complaintsData.forEach(complaint => {
        const loc = complaint.location || 'Unknown';
        if (!locationMap[loc]) {
          locationMap[loc] = {
            id: loc.replace(/\s+/g, '_'),
            name: loc,
            complaints: [],
            totalComplaints: 0
          };
        }
        locationMap[loc].complaints.push(complaint);
        locationMap[loc].totalComplaints++;
      });

      const areasArray = Object.values(locationMap).map((area, i, arr) => {
        const angle = (i / arr.length) * 2 * Math.PI;
        const radius = 180;
        const centerX = 300;
        const centerY = 250;
        
        return {
          ...area,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          severity: getSeverityFromComplaints(area.complaints)
        };
      });

      setAreas(areasArray);
      
      const conns = [];
      for (let i = 0; i < areasArray.length; i++) {
        for (let j = i + 1; j < Math.min(i + 3, areasArray.length); j++) {
          conns.push({ from: areasArray[i].id, to: areasArray[j].id });
        }
      }
      setConnections(conns);
      
    } catch (err) {
      console.error("Error fetching complaints:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (complaintId, newStatus) => {
  try {
    const res = await fetch(`http://localhost:5000/api/complaint/status`, {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: JSON.stringify({ id: complaintId, status: newStatus }),
    });

    if (res.ok) {
      await fetchComplaints();
      alert(`Status updated to ${newStatus}!`);
    } else {
      const error = await res.json();
      alert('Failed to update: ' + (error.message || 'Unknown error'));
    }
  } catch (err) {
    console.error("Error updating status:", err);
    alert('Error: ' + err.message);
  }
};


  const undoStatusChange = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaint/undo', {
        method: 'POST'
      , headers: getAuthHeaders(true) });
      if (res.ok) {
        await fetchComplaints();
        alert('Undo successful!');
      }
    } catch (err) {
      console.error('Undo error:', err);
    }
  };

  const redoStatusChange = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaint/redo', {
        method: 'POST', headers: getAuthHeaders(true) });
      if (res.ok) {
        await fetchComplaints();
        alert('Redo successful!');
      }
    } catch (err) {
      console.error('Redo error:', err);
    }
  };

  const getSeverityFromComplaints = (complaints) => {
    const highPriority = complaints.filter(c => c.priority === 'High').length;
    const mediumPriority = complaints.filter(c => c.priority === 'Medium').length;
    
    if (highPriority > 2) return 'critical';
    if (highPriority > 0) return 'high';
    if (mediumPriority > 2) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626'
    };
    return colors[severity] || '#6b7280';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const fetchCluster = async (startArea, mode) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/graph/${mode}/${startArea}`);
      const data = await response.json();
      
      const cluster = data.cluster || [];
      const areaIds = Array.from(new Set(cluster.map(c => c.location?.replace(/\s+/g, '_'))));
      
      setClusterData({
        startArea,
        mode,
        path: areaIds,
        complaints: cluster,
        totalComplaints: cluster.length,
      });
    } catch (error) {
      console.error('Error fetching cluster:', error);
      const connectedAreas = connections
        .filter(conn => conn.from === startArea || conn.to === startArea)
        .map(conn => conn.from === startArea ? conn.to : conn.from);
      
      setClusterData({
        startArea,
        mode,
        path: [startArea, ...connectedAreas.slice(0, 3)],
        complaints: [],
        totalComplaints: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAreaClick = (area) => {
    setSelectedArea(area);
    fetchCluster(area.id, traversalMode);
  };

  const addComplaint = async () => {
    try {
      const areaData = areas.find(a => a.id === newComplaint.area);
      const location = areaData?.name || newComplaint.location;
      
      const complaintData = {
        fullName: newComplaint.fullName,
        email: newComplaint.email,
        phone: newComplaint.phone,
        cnic: newComplaint.cnic,
        location: location,
        complaintDetails: newComplaint.complaintDetails,
        priority: newComplaint.priority,
        status: 'Pending'
      };

      const response = await fetch('http://localhost:5000/api/complaint', {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify(complaintData)
      });
      
      if (response.ok) {
        // Add to graph
        await fetch('http://localhost:5000/api/graph/add', {
          method: 'POST',
          headers: getAuthHeaders(true),
          body: JSON.stringify({ area: location, complaint: complaintData })
        });
        
        await fetchComplaints();
        setShowAddForm(false);
        setNewComplaint({ 
          area: '', fullName: '', email: '', phone: '', cnic: '',
          location: '', complaintDetails: '', priority: 'Low'
        });
        alert('Complaint added successfully!');
      }
    } catch (error) {
      console.error('Error adding complaint:', error);
      alert('Failed to add complaint');
    }
  };

  const isInCluster = (areaId) => clusterData?.path?.includes(areaId);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  if (isLoading && areas.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 mx-auto text-green-400 mb-4 animate-spin" />
          <p className="text-gray-700 text-lg">Loading complaint map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <MapPin size={36} />
                Live Complaint Map - NA-245
              </h1>
              <p className="text-green-50 mt-1">Real-time visualization with graph traversal</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={undoStatusChange}
                className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all"
                title="Undo last status change"
              >
                <Undo size={20} />
                Undo
              </button>
              <button
                onClick={redoStatusChange}
                className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all"
                title="Redo last undone change"
              >
                <Redo size={20} />
                Redo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">In Progress</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
              <Layers size={16} />
              Traversal Algorithm
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setTraversalMode('bfs')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  traversalMode === 'bfs'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                BFS
              </button>
              <button
                onClick={() => setTraversalMode('dfs')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  traversalMode === 'dfs'
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                DFS
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Locations</span>
              <span className="text-2xl font-bold text-green-600">{areas.length}</span>
            </div>
            <div className="text-xs text-gray-500">{complaints.length} total complaints</div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchComplaints}
              className="flex-1 bg-gray-100 text-gray-700 rounded-xl p-4 font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex-1 bg-green-500 text-white rounded-xl p-4 font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Complaint</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name *" value={newComplaint.fullName} onChange={(e) => setNewComplaint({ ...newComplaint, fullName: e.target.value })} className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500" />
              <input type="email" placeholder="Email *" value={newComplaint.email} onChange={(e) => setNewComplaint({ ...newComplaint, email: e.target.value })} className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500" />
              <input type="tel" placeholder="Phone *" value={newComplaint.phone} onChange={(e) => setNewComplaint({ ...newComplaint, phone: e.target.value })} className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="CNIC" value={newComplaint.cnic} onChange={(e) => setNewComplaint({ ...newComplaint, cnic: e.target.value })} className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500" />
              <select value={newComplaint.area} onChange={(e) => setNewComplaint({ ...newComplaint, area: e.target.value })} className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500">
                <option value="">Select Location *</option>
                {areas.map(a => (<option key={a.id} value={a.id}>{a.name}</option>))}
              </select>
              <select value={newComplaint.priority} onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })} className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500">
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
              <textarea placeholder="Complaint Details *" value={newComplaint.complaintDetails} onChange={(e) => setNewComplaint({ ...newComplaint, complaintDetails: e.target.value })} className="bg-gray-50 text-gray-900 rounded-lg px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-green-500 col-span-2" rows="3" />
              <button onClick={addComplaint} disabled={!newComplaint.area || !newComplaint.fullName || !newComplaint.email || !newComplaint.complaintDetails} className="bg-green-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed col-span-2 shadow-md">
                Submit Complaint
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-md">
            {areas.length === 0 ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
                  <p className="text-gray-600">No data available</p>
                </div>
              </div>
            ) : (
              <svg width="100%" height="500" className="bg-gray-50 rounded-lg">
                {connections.map((conn, i) => {
                  const fromArea = areas.find(a => a.id === conn.from);
                  const toArea = areas.find(a => a.id === conn.to);
                  if (!fromArea || !toArea) return null;
                  const highlighted = isInCluster(conn.from) && isInCluster(conn.to);
                  return (<line key={i} x1={fromArea.x} y1={fromArea.y} x2={toArea.x} y2={toArea.y} stroke={highlighted ? '#22c55e' : '#d1d5db'} strokeWidth={highlighted ? '3' : '2'} strokeDasharray={highlighted ? '0' : '5,5'} opacity={highlighted ? '1' : '0.5'} />);
                })}
                {areas.map((area) => {
                  const highlighted = isInCluster(area.id);
                  const color = getSeverityColor(area.severity);
                  return (
                    <g key={area.id} onClick={() => handleAreaClick(area)} className="cursor-pointer">
                      {highlighted && (<circle cx={area.x} cy={area.y} r="35" fill={color} opacity="0.2" className="animate-pulse" />)}
                      <circle cx={area.x} cy={area.y} r="25" fill={color} opacity={highlighted ? '1' : '0.9'} stroke={highlighted ? '#22c55e' : color} strokeWidth={highlighted ? '3' : '2'} />
                      <text x={area.x} y={area.y + 5} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{area.totalComplaints}</text>
                      <text x={area.x} y={area.y + 45} textAnchor="middle" fill={highlighted ? '#22c55e' : '#6b7280'} fontSize="11" fontWeight="600">{area.name.length > 15 ? area.name.substring(0, 15) + '...' : area.name}</text>
                    </g>
                  );
                })}
              </svg>
            )}
            <div className="mt-4 flex flex-wrap gap-4">
              {['low', 'medium', 'high', 'critical'].map(severity => (
                <div key={severity} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getSeverityColor(severity) }} />
                  <span className="text-sm text-gray-600 capitalize">{severity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {selectedArea && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-green-500" />
                  {selectedArea.name}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complaints</span>
                    <span className="font-bold text-xl">{selectedArea.totalComplaints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Severity</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold capitalize" style={{ backgroundColor: getSeverityColor(selectedArea.severity) + '40', color: getSeverityColor(selectedArea.severity) }}>{selectedArea.severity}</span>
                  </div>
                  <button onClick={() => setShowComplaintModal(true)} className="w-full bg-green-500 text-white rounded-lg px-4 py-2 font-medium hover:bg-green-600 mt-3">View All Complaints</button>
                </div>
              </div>
            )}

            {clusterData && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Layers size={20} className="text-green-500" />
                  Cluster Analysis ({clusterData.mode.toUpperCase()})
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 text-sm">Connected Areas</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {clusterData.path.map(areaId => {
                        const area = areas.find(a => a.id === areaId);
                        return area ? (<span key={areaId} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">{area.name}</span>) : null;
                      })}
                    </div>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-gray-600">Total</span>
                    <span className="font-bold text-xl">{clusterData.totalComplaints}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Locations</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {areas.map(area => (
                  <div key={area.id} onClick={() => handleAreaClick(area)} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSeverityColor(area.severity) }} />
                      <span className="text-gray-900 font-medium text-sm">{area.name}</span>
                    </div>
                    <span className="text-gray-700 font-semibold">{area.totalComplaints}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showComplaintModal && selectedArea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Complaints in {selectedArea.name}</h3>
              <button onClick={() => setShowComplaintModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              {selectedArea.complaints.map(complaint => (
                <div key={complaint.id} className="border rounded-lg p-4">
                  <div className="flex justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{complaint.fullName}</h4>
                      <p className="text-sm text-gray-500">{complaint.email} • {complaint.phone}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(complaint.status)}`}>{complaint.status}</span>
                  </div>
                  <p className="text-sm bg-gray-50 p-3 rounded mb-3">{complaint.complaintDetails}</p>
                  <div className="flex gap-2">
                    <button onClick={() => updateStatus(complaint.user?.email, 'Pending')} disabled={complaint.status === 'Pending'} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50">Pending</button>
                    <button onClick={() => updateStatus(complaint.id, 'In Progress')} disabled={complaint.status === 'In Progress'} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">In Progress</button>
                    <button onClick={() => updateStatus(complaint.id, 'Resolved')} disabled={complaint.status === 'Resolved'} className="flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 disabled:opacity-50">Resolved</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintMap;