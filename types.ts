
export enum ComplaintStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
  REJECTED = 'Rejected'
}

export enum ComplaintCategory {
  GARBAGE = 'Garbage',
  ROADS = 'Roads',
  WATER = 'Water Supply',
  ELECTRICITY = 'Electricity',
  DRAINAGE = 'Drainage',
  PUBLIC_HEALTH = 'Public Health',
  OTHERS = 'Others'
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  status: ComplaintStatus;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  image?: string;
  createdAt: string;
  updatedAt: string;
  urgency: 'Low' | 'Medium' | 'High';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CITIZEN' | 'ADMIN';
}
