import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/leaderboard");
        const data = await res.json();
        const leaderboardData = data.top || [];

        // Ensure joinedDate is always a string
        const processedData = leaderboardData.map(u => ({
          ...u,
          joinedDate: u.joinedDate ? new Date(u.joinedDate).toLocaleDateString() : "N/A"
        }));

        setUsers(processedData);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getResolutionRate = (resolved, total) => {
    if (total === 0) return 0;
    return Math.round((resolved / total) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-green-500 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Community Leaderboard
          </h1>
          <p className="text-gray-600 text-lg">Recognizing our top contributors</p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {users[1] && <PodiumCard user={users[1]} place={2} icon={<Award className="w-10 h-10 text-gray-400" />} />}
          {users[0] && <PodiumCard user={users[0]} place={1} icon={<Trophy className="w-12 h-12 text-yellow-500" />} isFirst />}
          {users[2] && <PodiumCard user={users[2]} place={3} icon={<Medal className="w-10 h-10 text-orange-400" />} />}
        </div>

        {/* Rest of Rankings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Contributors</h2>
          {users.length > 3 ? (
            <div className="space-y-3">
              {users.slice(3).map((user, index) => (
                <div 
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-green-500">#{index + 4}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">Member since {user.joinedDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <StatItem icon={<TrendingUp className="w-4 h-4 text-green-500" />} value={user.totalComplaints} label="Reports" />
                    <StatItem icon={<CheckCircle className="w-4 h-4 text-gray-600" />} value={user.resolvedComplaints} label="Resolved" />
                    <StatItem icon={<Clock className="w-4 h-4 text-gray-400" />} value={user.pendingComplaints} label="Pending" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No additional contributors yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Top 3 Podium card component
const PodiumCard = ({ user, place, icon, isFirst = false }) => {
  return (
    <div className={`order-${place} md:order-${place}`}>
      <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow ${isFirst ? "bg-gradient-to-br from-green-400 to-green-500 border-green-300 transform md:scale-110" : ""}`}>
        <div className="flex justify-center mb-4">
          <div className={`w-16 h-16 ${isFirst ? "w-20 h-20 bg-white shadow-lg" : "bg-gray-100"} rounded-full flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <div className="text-center mb-4">
          <div className={`text-3xl font-bold ${isFirst ? "text-white" : "text-gray-400"} mb-1`}>#{place}</div>
          <h3 className={`text-xl font-bold ${isFirst ? "text-white text-2xl" : "text-gray-900"}`}>{user.name}</h3>
          <p className={`text-sm mt-1 ${isFirst ? "text-white opacity-90" : "text-gray-500"}`}>
            Since {user.joinedDate}
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isFirst ? "text-white opacity-90" : "text-gray-600"}`}>Total Reports</span>
            <span className={`${isFirst ? "text-2xl text-white" : "text-lg font-bold text-green-500"}`}>{user.totalComplaints}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isFirst ? "text-white opacity-90" : "text-gray-600"}`}>Resolved</span>
            <span className={`${isFirst ? "text-xl font-semibold text-white" : "text-lg font-semibold text-gray-900"}`}>{user.resolvedComplaints}</span>
          </div>
          <div className={`w-full ${isFirst ? "bg-white bg-opacity-30" : "bg-gray-200"} rounded-full h-2`}>
            <div 
              className={`${isFirst ? "bg-white" : "bg-green-500"} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${user.totalComplaints ? (user.resolvedComplaints / user.totalComplaints) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat item for other users
const StatItem = ({ icon, value, label }) => (
  <div className="text-center hidden md:block">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

export default Leaderboard;
