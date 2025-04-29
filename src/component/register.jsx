import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../component/sidebar';
import axios from 'axios';
import { toast } from 'react-hot-toast'; // Import react-hot-toast
// import Cookies from 'js-cookie';

const apiUrlExport = "http://localhost:3000/api/users/export";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk handle ekspor
  const handleExport = async () => {
    setIsLoading(true);
    try {
      const token = Cookies.get("access_token");  // Ambil token dari cookies
      const response = await axios.get(apiUrlExport, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Template_Project.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // Success message with react-hot-toast
      toast.success('Ekspor berhasil!');
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Error exporting data"; // Custom error message
      toast.error(errorMsg);  // Display error message
      console.error("Error exporting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Users Management</h2>

        <div className="mb-4 flex space-x-4">
          <Link
            to="/addUser"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add User
          </Link>

          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "Exporting..." : "Export to Excel"}
          </button>
        </div>

        {/* Display Users or Empty State */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          {/* Your user table logic */}
        </div>
      </div>
    </div>
  );
}
