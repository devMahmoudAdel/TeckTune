/*
user schema:
id
name
email
phone
address
avatar link
role (admin,user)
status (active,banned)
lastActive (now - last login) in days


*/

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
    },
    avatar: "https://example.com/avatar1.png",
    role: "admin",
    status: "active",
    createdAt: "2023-01-01",
    lastLogin: "2025-04-02T10:00:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-04-02T10:00:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "janesmith@example.com",
    phone: "987-654-3210",
    address: {
      street: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
    },
    avatar: "https://example.com/avatar2.png",
    role: "user",
    status: "banned",
    createdAt: "2023-02-15",
    lastLogin: "2025-03-30T15:30:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-03-30T15:30:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    phone: "555-123-4567",
    address: {
      street: "789 Oak St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
    },
    avatar: "https://example.com/avatar3.png",
    role: "admin",
    status: "active",
    createdAt: "2023-03-10",
    lastLogin: "2025-04-01T12:00:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-04-01T12:00:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bobbrown@example.com",
    phone: "444-555-6666",
    address: {
      street: "321 Pine St",
      city: "Houston",
      state: "TX",
      zip: "77001",
    },
    avatar: "https://example.com/avatar4.png",
    role: "user",
    status: "banned",
    createdAt: "2023-04-20",
    lastLogin: "2025-03-15T08:30:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-03-15T08:30:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charliedavis@example.com",
    phone: "222-333-4444",
    address: {
      street: "654 Maple St",
      city: "Phoenix",
      state: "AZ",
      zip: "85001",
    },
    avatar: "https://example.com/avatar5.png",
    role: "admin",
    status: "active",
    createdAt: "2023-05-05",
    lastLogin: "2025-04-02T14:45:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-04-02T14:45:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 6,
    name: "Diana Evans",
    email: "dianaevans@example.com",
    phone: "111-222-3333",
    address: {
      street: "987 Birch St",
      city: "Philadelphia",
      state: "PA",
      zip: "19019",
    },
    avatar: "https://example.com/avatar6.png",
    role: "user",
    status: "active",
    createdAt: "2023-06-15",
    lastLogin: "2025-03-28T09:15:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-03-28T09:15:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 7,
    name: "Ethan Foster",
    email: "ethanfoster@example.com",
    phone: "777-888-9999",
    address: {
      street: "123 Cedar St",
      city: "San Antonio",
      state: "TX",
      zip: "78201",
    },
    avatar: "https://example.com/avatar6.png",
    role: "admin",
    status: "active",
    createdAt: "2023-07-25",
    lastLogin: "2025-03-20T11:00:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-03-20T11:00:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 8,
    name: "Fiona Green",
    email: "fionagreen@example.com",
    phone: "888-999-0000",
    address: {
      street: "456 Spruce St",
      city: "San Diego",
      state: "CA",
      zip: "92101",
    },
    avatar: "https://example.com/avatar8.png",
    role: "user",
    status: "active",
    createdAt: "2023-08-10",
    lastLogin: "2025-04-03T16:20:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-04-03T16:20:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 9,
    name: "George Harris",
    email: "georgeharris@example.com",
    phone: "999-000-1111",
    address: {
      street: "789 Willow St",
      city: "Dallas",
      state: "TX",
      zip: "75201",
    },
    avatar: "https://example.com/avatar9.png",
    role: "admin",
    status: "active",
    createdAt: "2023-09-05",
    lastLogin: "2025-04-04T09:00:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-04-04T09:00:00Z")) / (1000 * 60 * 60 * 24)),
  },
  {
    id: 10,
    name: "Hannah White",
    email: "hannahwhite@example.com",
    phone: "000-111-2222",
    address: {
      street: "321 Aspen St",
      city: "Austin",
      state: "TX",
      zip: "73301",
    },
    avatar: "https://example.com/avatar10.png",
    role: "user",
    status: "banned",
    createdAt: "2023-10-01",
    lastLogin: "2025-03-25T13:10:00Z",
    lastActive: Math.floor((new Date() - new Date("2025-03-25T13:10:00Z")) / (1000 * 60 * 60 * 24)),
  },
];

export default users;