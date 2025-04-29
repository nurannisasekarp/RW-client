import React, { useState, useEffect } from 'react';
import Sidebar from '../component/sidebar';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

export default function UserList() {
  const [users, setUsers] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const usersPerPage = 10;

  const axiosConfig = {
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${Cookies.get('access_token')}`
    }
  };

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user', axiosConfig);
        console.log("Response data:", response.data); 
        setUsers(response.data.users || []); 
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(users.length / usersPerPage); 
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleEditUser = (userId) => {
    navigate(`/edit-user/${userId}`); // Redirect to the edit-user page with the userId
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`/api/user/${userId}`, axiosConfig);

      const filteredUsers = users.filter((user) => user.id !== userId);
      setUsers(filteredUsers);

      if ((currentPage - 1) * usersPerPage >= filteredUsers.length) {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }

      // Success alert
      toast.success("User deleted successfully!");  
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Failed to delete user. Please try again.");  
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen min-h-screen bg-gradient-to-b from-blue-50 to-white flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Users Management</h2>

        <div className="mb-4 flex space-x-4">
          <Link
            to="/add-user"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add User
          </Link>

          <button
            onClick={handleExportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          >
            Export to Excel
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading users...</div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 text-left">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3 space-x-2">
                        <button
                          className="text-yellow-500 hover:text-yellow-600 font-medium"
                          onClick={() => handleEditUser(user.id)} // Pass userId for the redirect
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-600 font-medium"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
      <ToastContainer /> 
    </div>
  );
}
