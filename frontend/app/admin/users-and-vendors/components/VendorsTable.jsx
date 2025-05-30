import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSearch } from 'react-icons/fa';
import { BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Pagination from "@/app/admin/users-and-vendors/components/Pagination";
import Spinner from '@/app/components/Spinner';

const VendorsTable = ({
    vendors,
    onVerifyVendor,
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
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-semibold">All Vendors Management</h3>
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
                            <SelectValue placeholder="Filter vendors" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Vendors</SelectItem>
                            <SelectItem value="verified">Verified Vendors</SelectItem>
                            <SelectItem value="new">New Chef</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Vendor Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
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
                                <td colSpan="5" className="px-6 py-8">
                                    <Spinner />
                                </td>
                            </tr>
                        ) : vendors.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    No vendors found
                                </td>
                            </tr>
                        ) : (
                            vendors.map((vendor) => (
                                <tr key={vendor.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {vendor.storeName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {vendor.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(vendor.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vendor.isVerified ? (
                                            <span className="flex items-center justify-center gap-1 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs w-24">
                                                <BadgeCheck size={14} /> Verified
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-1 bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs w-24">
                                                <BadgeCheck size={14} /> New Chef
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {!vendor.isVerified ? (
                                            <button
                                                onClick={() => onVerifyVendor(vendor.id)}
                                                className="text-green-600 hover:text-green-900 font-medium mr-3"
                                            >
                                                Verify
                                            </button>
                                        ) : (
                                            <span className="text-green-600 font-medium">Verified</span>
                                        )}
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

export default VendorsTable; 