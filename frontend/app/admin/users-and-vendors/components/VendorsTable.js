import React, { useState } from 'react';
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
    onFilterChange
}) => {
    const [selectedVendor, setSelectedVendor] = useState(null);

    const handleVerifyClick = (vendor) => {
        setSelectedVendor(vendor);
    };

    const handleCloseModal = () => {
        setSelectedVendor(null);
    };

    const handleVerify = async () => {
        if (selectedVendor) {
            await onVerifyVendor(selectedVendor.id);
            handleCloseModal();
        }
    };

    const handleReject = () => {
        handleCloseModal();
    };

    return (
        <div className="mt-8">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <form onSubmit={onSearchSubmit} className="flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                placeholder="Search vendors..."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </form>
                        <div className="flex gap-2">
                            <select
                                value={filter}
                                onChange={(e) => onFilterChange(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Vendors</option>
                                <option value="verified">Verified</option>
                                <option value="new">New</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : vendors.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        No vendors found
                                    </td>
                                </tr>
                            ) : (
                                vendors.map((vendor) => (
                                    <tr key={vendor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 relative">
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
                                            <div className="text-sm text-gray-900">{vendor.fullName}</div>
                                            <div className="text-sm text-gray-500">{vendor.phoneNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{vendor.city}</div>
                                            <div className="text-sm text-gray-500">{vendor.businessAddress}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                vendor.isVerified
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {vendor.isVerified ? 'Verified' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(vendor.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {!vendor.isVerified && (
                                                <button
                                                    onClick={() => handleVerifyClick(vendor)}
                                                    className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                                                >
                                                    Verify
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-4 py-3 border-t flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                                <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
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
        </div>
    );
};

export default VendorsTable; 