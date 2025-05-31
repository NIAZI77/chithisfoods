import React, { useEffect } from 'react';
import { FaUserCheck, FaUserTimes, FaSearch } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Pagination from "@/app/admin/users-and-vendors/components/Pagination";
import Spinner from '@/app/components/Spinner';

const UsersTable = ({
    users,
    onBlockUser,
    formatDate,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    searchQuery,
    onSearchChange,
    onSearchSubmit,
    filter,
    onFilterChange
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearchSubmit(e);
        }
    };

    return (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-semibold">All Users Management</h3>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <form onSubmit={onSearchSubmit} className="flex">
                        <div className="relative flex items-center">
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Search"
                                className="bg-gray-100 pl-10 pr-4 py-2 rounded-full border-none outline-none w-full sm:w-64"
                            />
                            <FaSearch className="w-5 h-5 text-gray-500 absolute left-3" />
                        </div>
                    </form>
                    <Select value={filter} onValueChange={onFilterChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter users" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="active">Active Users</SelectItem>
                            <SelectItem value="blocked">Blocked Users</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Username
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Provider
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Registration Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.username}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="capitalize">{user.provider}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.blocked ? (
                                            <span className="flex items-center justify-center gap-1 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs w-fit">
                                                <FaUserTimes size={14} /> Blocked
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs w-fit">
                                                <FaUserCheck size={14} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button
                                            onClick={() => onBlockUser(user.id, user.blocked)}
                                            className={`${user.blocked
                                                    ? "text-green-600 hover:text-green-900"
                                                    : "text-red-600 hover:text-red-900"
                                                } font-medium`}
                                        >
                                            {user.blocked ? "Unblock" : "Block"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default UsersTable; 