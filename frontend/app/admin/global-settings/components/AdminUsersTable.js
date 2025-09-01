"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Users, CheckCircle, Trash2 } from "lucide-react";
import TableLoading from "@/components/TableLoading";

const AdminUsersTable = ({ isMainAdmin, currentUser }) => {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add prop validation
  if (typeof isMainAdmin !== "boolean") {
    console.warn("AdminUsersTable: isMainAdmin prop should be a boolean");
  }

  if (currentUser && typeof currentUser !== "object") {
    console.warn(
      "AdminUsersTable: currentUser prop should be an object or null"
    );
  }

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    setLoading(true);
    try {
      // Check if API token is available
      if (!process.env.NEXT_PUBLIC_STRAPI_TOKEN) {
        throw new Error("API token not configured");
      }

      // Fetch only admin users with specific filters to reduce API load
      const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users?filters[isAdmin][$eq]=true&filters[admintype][$ne]=none&filters[isAdminVerified][$ne]=none&sort=createdAt:desc`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setAdminUsers(data);
      } else if (data.data && Array.isArray(data.data)) {
        setAdminUsers(data.data);
      } else {
        setAdminUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users. Please try again.");
      setAdminUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAdmin = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            isAdmin: true,
            isAdminVerified: "verified",
          }),
        }
      );

      if (response.ok) {
        toast.success("Admin user verified successfully!");
        fetchAdminUsers(); // Refresh the list
      } else {
        toast.error("Failed to verify admin user.");
      }
    } catch (error) {
      console.error("Error verifying admin:", error);
      toast.error("An error occurred while verifying the admin user.");
    }
  };

  const handleDeleteAdmin = async (userId, email) => {
    if (
      !confirm(
        `Are you sure you want to delete admin user "${email}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Admin user deleted successfully!");
        fetchAdminUsers(); // Refresh the list
      } else {
        toast.error("Failed to delete admin user.");
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("An error occurred while deleting the admin user.");
    }
  };

  const getStatusClasses = (user) => {
    if (user.isAdminVerified === "verified") {
      return "bg-green-100 text-green-700";
    }
    if (user.isAdminVerified === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  const getStatusText = (user) => {
    if (user.isAdminVerified === "verified") {
      return "Verified";
    }
    if (user.isAdminVerified === "pending") {
      return "Pending";
    }
    return "None";
  };

  const getAdminTypeText = (user) => {
    if (user.admintype === "main") return "Main Admin";
    if (user.admintype === "regular") return "Regular Admin";
    return "None";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Since API now returns only admin users, we can use the data directly
  const adminUsersToDisplay = adminUsers;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg md:text-xl font-semibold text-pink-800">
          ADMIN USERS
        </h2>
        <button
          onClick={fetchAdminUsers}
          className="px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100 transition-colors"
          title="Refresh admin users list"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      {adminUsersToDisplay.length === 0 && !loading ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-pink-50">
            <Users className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Admin Users Found
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            No admin users found in the system.
          </p>
        </div>
      ) : (
        <>
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 6px;
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #888;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #666;
            }
          `}</style>
          {loading ? (
            <TableLoading rows={8} columns={5} />
          ) : (
            <div className="overflow-x-auto rounded-md -mx-4 sm:mx-0 custom-scrollbar">
              <div className="min-w-[900px] sm:min-w-full">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Admin Type
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                      >
                        Created Date
                      </th>
                      {isMainAdmin && (
                        <th
                          scope="col"
                          className="px-2 sm:px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase whitespace-nowrap"
                        >
                          Actions
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {adminUsersToDisplay.map((user, index) => (
                      <tr
                        key={`${user.id}-${index}`}
                        className="bg-white hover:bg-gray-50 border-b border-gray-100"
                      >
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {user.email || "N/A"}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                          <span className="px-2 sm:px-3 py-1 text-xs leading-5 font-medium rounded-full">
                            {getAdminTypeText(user)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                          <span
                            className={`px-2 sm:px-3 py-1 text-xs leading-5 font-medium rounded-full mx-auto ${getStatusClasses(
                              user
                            )}`}
                          >
                            {getStatusText(user)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-500 text-center">
                          {formatDate(user.createdAt)}
                        </td>
                        {isMainAdmin && (
                          <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-center">
                            <div className="flex justify-center space-x-2">
                              {/* Verify button for pending admins */}
                              {user.isAdminVerified === "pending" && (
                                <button
                                  onClick={() => handleVerifyAdmin(user.id)}
                                  className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                  title="Verify Admin"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}

                              {/* Delete button for all admins except current user */}
                              {user.id !== currentUser?.id &&
                                (user.isAdmin ||
                                  user.isAdminVerified === "pending") && (
                                  <button
                                    onClick={() =>
                                      handleDeleteAdmin(user.id, user.email)
                                    }
                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                                    title="Delete Admin"
                                    disabled={!currentUser}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsersTable;
