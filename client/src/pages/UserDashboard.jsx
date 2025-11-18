import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Calendar,
  FileText,
  Image,
  Trash2,
  Edit,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

export default function UserDashboard() {
  const [user, setUser] = useState(null); 
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/complaints/user", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = res.data.complaints.map(c => ({
          id: c._id,
          status: c.status,
          complaint: c.description,
          date: new Date(c.createdAt).toLocaleDateString(),
          location: c.location,
          image: c.image || null,
          user: c.user, // in case populate needed
        }));

        setComplaints(data);

        // Use first complaint's user info as logged-in user display
        if (data.length > 0 && data[0].user) {
          setUser({
            name: data[0].user.name,
            email: data[0].user.email,
            phone: data[0].user.mobile,
            joinDate: data[0].user.joinDate || data[0].date, // fallback
          });
        } else {
          // Default user info if no complaints yet
          setUser({
            name: "Logged-in User",
            email: "user@example.com",
            phone: "+92 300 0000000",
            joinDate: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      }
    };

    fetchComplaints();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/complaints/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setComplaints(prev => prev.filter(c => c.id !== id));
      setSelectedComplaint(null);
    } catch (err) {
      console.error("Failed to delete complaint:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-300";
      case "Resolved": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending": return <Clock className="w-4 h-4" />;
      case "In Progress": return <TrendingUp className="w-4 h-4" />;
      case "Resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (!user) return <div className="text-center py-20">Loading user info...</div>;

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">Member since {new Date(user.joinDate).toLocaleDateString()}</p>
            </div>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5" />
            New Complaint
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total" value={stats.total} icon={<FileText className="w-10 h-10 text-green-500" />} border="border-green-500" />
          <StatCard title="Pending" value={stats.pending} icon={<Clock className="w-10 h-10 text-yellow-500" />} border="border-yellow-500" />
          <StatCard title="In Progress" value={stats.inProgress} icon={<TrendingUp className="w-10 h-10 text-blue-500" />} border="border-blue-500" />
          <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle className="w-10 h-10 text-green-600" />} border="border-green-600" />
        </div>

        {/* Complaints List */}
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
                {complaints.map(c => (
                  <div
                    key={c.id}
                    className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-green-500 transition cursor-pointer"
                    onClick={() => setSelectedComplaint(selectedComplaint?.id === c.id ? null : c)}
                  >
                    <div className="p-5 bg-white">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(c.status)}`}>
                              {getStatusIcon(c.status)}{c.status}
                            </span>
                            <div className="flex items-center text-gray-600 text-sm">
                              <Calendar className="w-4 h-4 mr-1 text-green-500" />
                              {c.date}
                            </div>
                          </div>
                          <div className="flex items-start text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-1" />
                            <span className="font-semibold">{c.location}</span>
                          </div>
                          <p className="text-gray-600 ml-6 line-clamp-2">{c.complaint}</p>
                        </div>
                        {c.image && <img src={c.image} alt="Complaint" className="w-24 h-24 object-cover rounded-lg shadow-md" />}
                      </div>

                      {selectedComplaint?.id === c.id && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-100">
                          <div className="mb-4">
                            <label className="flex items-center text-gray-700 font-semibold text-sm mb-2">
                              <FileText className="w-4 h-4 mr-2 text-green-500" />
                              Full Complaint Details
                            </label>
                            <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{c.complaint}</p>
                          </div>
                          {c.image && (
                            <div className="mb-4">
                              <label className="flex items-center text-gray-700 font-semibold text-sm mb-2">
                                <Image className="w-4 h-4 mr-2 text-green-500" />
                                Attached Image
                              </label>
                              <img src={c.image} alt="Complaint" className="w-full max-h-80 object-cover rounded-lg shadow-md" />
                            </div>
                          )}
                          
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

function StatCard({ title, value, icon, border }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-semibold">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}
