import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const sampleUsers = [
    {
      id: 'user_001',
      name: 'Ahmed Khan',
      totalComplaints: 47,
      resolvedComplaints: 38,
      pendingComplaints: 9,
      joinedDate: 'Oct 15'
    },
    {
      id: 'user_002',
      name: 'Fatima Ali',
      totalComplaints: 42,
      resolvedComplaints: 35,
      pendingComplaints: 7,
      joinedDate: 'Oct 20'
    },
    {
      id: 'user_003',
      name: 'Hassan Raza',
      totalComplaints: 38,
      resolvedComplaints: 30,
      pendingComplaints: 8,
      joinedDate: 'Oct 22'
    },
    {
      id: 'user_004',
      name: 'Ayesha Malik',
      totalComplaints: 33,
      resolvedComplaints: 28,
      pendingComplaints: 5,
      joinedDate: 'Oct 25'
    },
    {
      id: 'user_005',
      name: 'Usman Sheikh',
      totalComplaints: 29,
      resolvedComplaints: 22,
      pendingComplaints: 7,
      joinedDate: 'Oct 28'
    },
    {
      id: 'user_006',
      name: 'Zainab Ahmed',
      totalComplaints: 25,
      resolvedComplaints: 20,
      pendingComplaints: 5,
      joinedDate: 'Nov 1'
    },
    {
      id: 'user_007',
      name: 'Ali Hassan',
      totalComplaints: 21,
      resolvedComplaints: 18,
      pendingComplaints: 3,
      joinedDate: 'Nov 3'
    },
    {
      id: 'user_008',
      name: 'Sara Imran',
      totalComplaints: 18,
      resolvedComplaints: 15,
      pendingComplaints: 3,
      joinedDate: 'Nov 5'
    },
    {
      id: 'user_009',
      name: 'Bilal Ahmed',
      totalComplaints: 15,
      resolvedComplaints: 12,
      pendingComplaints: 3,
      joinedDate: 'Nov 6'
    },
    {
      id: 'user_010',
      name: 'Mariam Khan',
      totalComplaints: 12,
      resolvedComplaints: 10,
      pendingComplaints: 2,
      joinedDate: 'Nov 7'
    }
  ];

  useEffect(() => {
    setUsers(sampleUsers);
    setLoading(false);
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
          <p className="text-gray-600 text-lg">
            Recognizing our top contributors
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 2nd Place */}
          {users[1] && (
            <div className="order-1 md:order-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <Award className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-gray-400 mb-1">#2</div>
                  <h3 className="text-xl font-bold text-gray-900">{users[1].name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Since {users[1].joinedDate}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Reports</span>
                    <span className="text-lg font-bold text-green-500">{users[1].totalComplaints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resolved</span>
                    <span className="text-lg font-semibold text-gray-900">{users[1].resolvedComplaints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getResolutionRate(users[1].resolvedComplaints, users[1].totalComplaints)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {users[0] && (
            <div className="order-0 md:order-2">
              <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-2xl p-6 shadow-2xl border-2 border-green-300 transform md:scale-110 hover:shadow-3xl transition-all">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                    <Trophy className="w-12 h-12 text-yellow-500" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-white mb-1">#1</div>
                  <h3 className="text-2xl font-bold text-white">{users[0].name}</h3>
                  <p className="text-sm text-white opacity-90 mt-1">Since {users[0].joinedDate}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white opacity-90">Total Reports</span>
                    <span className="text-2xl font-bold text-white">{users[0].totalComplaints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white opacity-90">Resolved</span>
                    <span className="text-xl font-semibold text-white">{users[0].resolvedComplaints}</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getResolutionRate(users[0].resolvedComplaints, users[0].totalComplaints)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {users[2] && (
            <div className="order-2 md:order-3">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                    <Medal className="w-10 h-10 text-orange-400" />
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-orange-400 mb-1">#3</div>
                  <h3 className="text-xl font-bold text-gray-900">{users[2].name}</h3>
                  <p className="text-sm text-gray-500 mt-1">Since {users[2].joinedDate}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Reports</span>
                    <span className="text-lg font-bold text-green-500">{users[2].totalComplaints}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resolved</span>
                    <span className="text-lg font-semibold text-gray-900">{users[2].resolvedComplaints}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getResolutionRate(users[2].resolvedComplaints, users[2].totalComplaints)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rest of Rankings */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Contributors</h2>
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
                  <div className="text-center hidden md:block">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-lg font-bold text-green-500">{user.totalComplaints}</span>
                    </div>
                    <div className="text-xs text-gray-500">Reports</div>
                  </div>
                  
                  <div className="text-center hidden md:block">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-lg font-semibold text-gray-900">{user.resolvedComplaints}</span>
                    </div>
                    <div className="text-xs text-gray-500">Resolved</div>
                  </div>
                  
                  <div className="text-center hidden md:block">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-lg font-medium text-gray-600">{user.pendingComplaints}</span>
                    </div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  
                  <div className="text-right">
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;