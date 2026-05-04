import React, { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Calendar,
  FileText,
  Image,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get User from LocalStorage immediately (Fixes the hardcoded/fallback issue)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from storage", e);
      }
    }

    // 2. Fetch Complaints
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(token)
        const res = await axios.get("http://localhost:5000/api/complaints/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Use the sanitized keys from your Oracle backend
        const formattedData = (res.data.complaints || []).map((c) => ({
          id: c.id,
          status: c.status,
          complaint: c.description,
          date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recent",
          location: c.location,
          image: c.image || null,
        }));

        setComplaints(formattedData);
      } catch (err) {
        console.error("Failed to fetch complaints:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

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

  if (loading) return <div className="text-center py-20 font-semibold text-green-600">Loading Dashboard...</div>;
  
  // If no user in localStorage and loading is done, they shouldn't be here
  if (!user) return <div className="text-center py-20">Please log in to view your dashboard.</div>;

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header - Now using localStorage data */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase tracking-wider">
                {user.role}
              </span>
            </div>
          </div>
          <Link to="/complaints" className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5" />
            New Complaint
          </Link>
        </div>

        {/* Stats Section */}
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
          </div>
          <div className="p-6">
            {complaints.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg font-semibold">No complaints found</p>
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
                      </div>
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