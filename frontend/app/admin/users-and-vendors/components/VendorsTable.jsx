import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BadgeCheck, XCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Pagination from "@/app/admin/users-and-vendors/components/Pagination";
import Spinner from '@/app/components/Spinner';
import VerificationBadge from '@/app/components/VerificationBadge';
import VendorVerificationModal from './VendorVerificationModal';

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
    onFilterChange,
    docFilter,
    onDocFilterChange
}) => {
    const [selectedVendor, setSelectedVendor] = useState(null);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSearchSubmit(e);
        }
    };

    const handleVerifyClick = (vendor) => {
        if (!vendor.documentId) {
            console.error('Missing vendor documentId');
            return;
        }
        setSelectedVendor(vendor);
    };

    const handleCloseModal = () => {
        setSelectedVendor(null);
    };

    const handleVerify = async (documentId, newStatus) => {
        if (!documentId || !newStatus) {
            console.error('Missing required parameters for verification');
            return;
        }
        try {
            await onVerifyVendor(documentId, newStatus);
            handleCloseModal();
        } catch (error) {
            console.error('Error verifying vendor:', error);
        }
    };

    const handleReject = () => {
        handleCloseModal();
    };

    return (
        <>
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
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Vendors</SelectItem>
                                <SelectItem value="verified">Verified</SelectItem>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="unverified">Unverified</SelectItem>
                                <SelectItem value="banned">Banned</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={docFilter} onValueChange={onDocFilterChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by documents" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="with_docs">With Documents</SelectItem>
                                <SelectItem value="without_docs">Without Documents</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Store Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8">
                                        <Spinner />
                                    </td>
                                </tr>
                            ) : vendors.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No vendors found
                                    </td>
                                </tr>
                            ) : (
                                vendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={vendor.avatar?.url || '/placeholder-avatar.jpg'}
                                                        alt={vendor.storeName}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{vendor.storeName}</div>
                                                    <div className="text-sm text-gray-500">{vendor.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <VerificationBadge status={vendor.verificationStatus} size="default" />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(vendor.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleVerifyClick(vendor)}
                                                className='px-5 py-2.5 text-pink-100 bg-pink-500 rounded-full'
                                            >
                                                See Details
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

            {selectedVendor && (
                <VendorVerificationModal
                    vendor={selectedVendor}
                    onClose={handleCloseModal}
                    onVerify={handleVerify}
                    onReject={handleReject}
                    isLoading={isLoading}
                />
            )}
        </>
    );
};

export default VendorsTable; 