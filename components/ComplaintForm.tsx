
import React, { useState, useRef } from 'react';
import { ComplaintCategory, Complaint, ComplaintStatus, User } from '../types';
import { CATEGORIES } from '../constants';
import { analyzeComplaint } from '../services/geminiService';

interface ComplaintFormProps {
  currentUser: User;
  onClose: () => void;
  onSubmit: (complaint: Complaint) => void;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ currentUser, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>(ComplaintCategory.OTHERS);
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [address, setAddress] = useState('Detecting Nashik location...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setAddress(`Nashik: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => setAddress("Nashik City Area (Location denied)")
      );
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!description || description.length < 10) {
      alert("Please enter a more detailed description (min 10 chars) first.");
      return;
    }
    setIsAnalyzing(true);
    const analysis = await analyzeComplaint(description + " (Context: Nashik city)");
    if (analysis) {
      setTitle(analysis.summary || title);
      const matchedCat = CATEGORIES.find(c => c.toLowerCase().includes(analysis.category.toLowerCase())) || category;
      setCategory(matchedCat as ComplaintCategory);
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: Complaint = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      title: title || 'Civic Issue in Nashik',
      description,
      category,
      status: ComplaintStatus.PENDING,
      location: {
        lat: 0,
        lng: 0,
        address: address.includes('Detecting') ? 'Nashik Municipal Area' : address
      },
      image: image || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      urgency: 'Medium'
    };
    onSubmit(newComplaint);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-orange-50/30">
          <h2 className="text-xl font-bold text-gray-900">Report a Civic Issue</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
            <label className="block text-xs font-bold text-orange-800 uppercase mb-2">Issue Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-white border border-orange-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="E.g. Broken drainage line in Satpur MIDC area..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="mt-2 flex items-center gap-2 text-xs font-bold text-orange-600 hover:text-orange-800 transition disabled:opacity-50"
            >
              <i className={`fa-solid ${isAnalyzing ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
              {isAnalyzing ? 'Analyzing with AI...' : 'Smart Analysis (Categorize automatically)'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Incident Title</label>
            <input
              type="text"
              required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="E.g. Road damage near College Road"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Photo (Optional)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-500 hover:border-orange-500 hover:text-orange-600 transition flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-camera"></i>
                {image ? 'Change Photo' : 'Attach Photo'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {image && (
            <div className="relative rounded-xl overflow-hidden h-32 w-full bg-gray-100 border border-gray-200">
              <img src={image} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-lg"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nashik Locality</label>
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <i className="fa-solid fa-location-crosshairs text-orange-500"></i>
              <span>{address}</span>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 transition active:scale-95"
            >
              Submit to NMC
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
