
import React from 'react';
import { ComplaintCategory, ComplaintStatus } from './types';

export const CATEGORY_ICONS: Record<ComplaintCategory, React.ReactNode> = {
  [ComplaintCategory.GARBAGE]: <i className="fa-solid fa-trash-can"></i>,
  [ComplaintCategory.ROADS]: <i className="fa-solid fa-road"></i>,
  [ComplaintCategory.WATER]: <i className="fa-solid fa-droplet"></i>,
  [ComplaintCategory.ELECTRICITY]: <i className="fa-solid fa-bolt"></i>,
  [ComplaintCategory.DRAINAGE]: <i className="fa-solid fa-faucet-drip"></i>,
  [ComplaintCategory.PUBLIC_HEALTH]: <i className="fa-solid fa-heart-pulse"></i>,
  [ComplaintCategory.OTHERS]: <i className="fa-solid fa-circle-question"></i>,
};

export const STATUS_COLORS: Record<ComplaintStatus, string> = {
  [ComplaintStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [ComplaintStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ComplaintStatus.RESOLVED]: 'bg-green-100 text-green-800 border-green-200',
  [ComplaintStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
};

export const CATEGORIES = Object.values(ComplaintCategory);
export const STATUSES = Object.values(ComplaintStatus);
