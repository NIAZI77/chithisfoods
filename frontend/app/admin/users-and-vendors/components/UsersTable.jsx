import React, { useEffect } from 'react';
import { FaUserCheck, FaUserTimes, FaSearch, FaUsers } from 'react-icons/fa';
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
import UserStatusBadge from '@/app/components/UserStatusBadge';

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

    const EmptyState = () => (
        <tr>
            <td colSpan="6" className="px-6 py-12">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                        <FaUsers className="w-8 h-8 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize text-pink-600">
                        {searchQuery ? 'No Users Found' : 'No Users Available'}
                    </h3>
                    <p className="text-gray-500 max-w-sm">
                        {searchQuery 
                            ? `No users match your search for "${searchQuery}". Try adjusting your search terms.`
                            : filter !== 'all' 
                                ? `No ${filter} users found. Try changing the filter or check back later.`
                                : 'There are currently no users registered in the system.'
                        }
                    </p>
                </div>
            </td>
        </tr>
    );

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
                            <EmptyState />
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
                                        <UserStatusBadge isBlocked={user.blocked} size="default" />
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