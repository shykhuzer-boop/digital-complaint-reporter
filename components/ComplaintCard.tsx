
import React from 'react';
import { Complaint, ComplaintStatus, User } from '../types';
import { CATEGORY_ICONS, STATUS_COLORS } from '../constants';

interface ComplaintCardProps {
  complaint: Complaint;
  currentUser: User;
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, currentUser, onUpdateStatus }) => {
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              {CATEGORY_ICONS[complaint.category]}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{complaint.title}</h3>
              <p className="text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[complaint.status]}`}>
            {complaint.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {complaint.description}
        </p>

        {complaint.image && (
          <div className="mb-4 rounded-lg overflow-hidden h-40 bg-gray-100">
            <img src={complaint.image} alt="Evidence" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
          <i className="fa-solid fa-location-dot text-red-500"></i>
          <span>{complaint.location.address}</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-600 font-bold uppercase">
              {complaint.userName.charAt(0)}
            </div>
            <span className="text-xs font-medium text-gray-700">{complaint.userName}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              complaint.urgency === 'High' ? 'bg-red-50 text-red-600' :
              complaint.urgency === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-600'
            }`}>
              {complaint.urgency} Priority
            </span>
          </div>
        </div>

        {isAdmin && complaint.status !== ComplaintStatus.RESOLVED && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {complaint.status === ComplaintStatus.PENDING && (
              <button
                onClick={() => onUpdateStatus(complaint.id, ComplaintStatus.IN_PROGRESS)}
                className="text-xs bg-blue-50 text-blue-600 py-2 rounded-lg font-bold hover:bg-blue-100 transition"
              >
                Mark In Progress
              </button>
            )}
            {complaint.status === ComplaintStatus.IN_PROGRESS && (
              <button
                onClick={() => onUpdateStatus(complaint.id, ComplaintStatus.RESOLVED)}
                className="text-xs bg-green-50 text-green-600 py-2 rounded-lg font-bold hover:bg-green-100 transition"
              >
                Mark Resolved
              </button>
            )}
            <button
              onClick={() => onUpdateStatus(complaint.id, ComplaintStatus.REJECTED)}
              className="text-xs bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition"
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintCard;
