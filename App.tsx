
import React, { useState, useEffect, useMemo } from 'react';
import { Complaint, User, ComplaintStatus, ComplaintCategory } from './types';
import Auth from './components/Auth';
import FilterBar from './components/FilterBar';
import ComplaintCard from './components/ComplaintCard';
import ComplaintForm from './components/ComplaintForm';

const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    userId: 'u1',
    userName: 'Rahul K.',
    title: 'Water Leakage near Panchavati',
    description: 'There is a major water pipe burst near the Kalaram Temple area. Clean water is being wasted on the road since 6 AM.',
    category: ComplaintCategory.WATER,
    status: ComplaintStatus.PENDING,
    urgency: 'High',
    location: { lat: 19.9975, lng: 73.7898, address: 'Panchavati Karanja, Nashik' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1584713508709-a3d6ad58e048?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    userId: 'u2',
    userName: 'Sneha Deshmukh',
    title: 'Garbage Pile in CIDCO',
    description: 'Waste collection van hasn\'t visited Sector 4, CIDCO for 3 days. Huge pile of garbage near the community park.',
    category: ComplaintCategory.GARBAGE,
    status: ComplaintStatus.IN_PROGRESS,
    urgency: 'Medium',
    location: { lat: 19.9613, lng: 73.7507, address: 'Sector 4, CIDCO, Nashik' },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    userId: 'u3',
    userName: 'Amit Patil',
    title: 'Potholes on Gangapur Road',
    description: 'Dangerous deep potholes developed near Jehan Circle. High risk of accidents for two-wheelers during night.',
    category: ComplaintCategory.ROADS,
    status: ComplaintStatus.RESOLVED,
    urgency: 'High',
    location: { lat: 20.0125, lng: 73.7650, address: 'Gangapur Road, Near Jehan Circle, Nashik' },
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString(),
    image: 'https://images.unsplash.com/photo-1594498257602-32638e982f9e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    userId: 'u4',
    userName: 'Vikas Shah',
    title: 'Street Light Failure - Nashik Road',
    description: 'Street lights not working from Nashik Road Railway Station to Bytco Point for the last week.',
    category: ComplaintCategory.ELECTRICITY,
    status: ComplaintStatus.PENDING,
    urgency: 'Medium',
    location: { lat: 19.9395, lng: 73.8340, address: 'Nashik Road Railway Station Area' },
    createdAt: new Date(Date.now() - 43200000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [complaints, selectedCategory, selectedStatus, searchQuery]);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddComplaint = (newComplaint: Complaint) => {
    setComplaints([newComplaint, ...complaints]);
    setIsFormOpen(false);
  };

  const handleUpdateStatus = (id: string, newStatus: ComplaintStatus) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c
    ));
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-orange-600 p-1.5 rounded-lg text-white">
              <i className="fa-solid fa-city"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-gray-900 leading-none">Nashik Civic</span>
              <span className="text-[10px] text-orange-600 font-bold tracking-widest uppercase">Reporter</span>
            </div>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search area (e.g. CIDCO, Satpur)..."
                className="w-full bg-gray-100 border-none rounded-full py-2 px-10 text-sm focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end text-right">
              <span className="text-sm font-bold text-gray-900">{user.name}</span>
              <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tight">{user.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nashik Civic Complaints</h1>
            <p className="text-gray-500">Helping citizens build a smarter and cleaner Nashik City</p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-plus"></i>
            Report New Issue
          </button>
        </div>

        <FilterBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        {filteredComplaints.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <i className="fa-solid fa-clipboard-list text-4xl text-gray-200 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900">No issues found for your search</h3>
            <p className="text-gray-500">Try adjusting your filters or search for another Nashik locality</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                currentUser={user}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Mobile Sticky Add Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-14 h-14 bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center text-xl transform active:scale-90 transition"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      </div>

      {isFormOpen && (
        <ComplaintForm
          currentUser={user}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleAddComplaint}
        />
      )}
    </div>
  );
};

export default App;
