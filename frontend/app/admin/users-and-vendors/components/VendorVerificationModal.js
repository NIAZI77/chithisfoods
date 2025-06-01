import React from 'react';
import Image from 'next/image';

const VendorVerificationModal = ({ vendor, onClose, onVerify, onReject, isLoading }) => {
    if (!vendor) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Vendor Verification</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="relative w-full h-48 rounded-lg overflow-hidden">
                                <Image
                                    src={vendor.avatar?.url || '/placeholder-avatar.jpg'}
                                    alt={vendor.storeName}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative w-full h-32 rounded-lg overflow-hidden">
                                <Image
                                    src={vendor.coverImage?.url || '/placeholder-cover.jpg'}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Store Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Store Name:</span> {vendor.storeName}</p>
                                    <p><span className="font-medium">Business Address:</span> {vendor.businessAddress}</p>
                                    <p><span className="font-medium">City:</span> {vendor.city}</p>
                                    <p><span className="font-medium">Zipcode:</span> {vendor.zipcode}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Full Name:</span> {vendor.fullName}</p>
                                    <p><span className="font-medium">Email:</span> {vendor.email}</p>
                                    <p><span className="font-medium">Phone:</span> {vendor.phoneNumber}</p>
                                    <p><span className="font-medium">PayPal Email:</span> {vendor.paypalEmail}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg mb-2">Additional Information</h3>
                                <div className="space-y-2">
                                    <p><span className="font-medium">Bio:</span> {vendor.bio}</p>
                                    <p><span className="font-medium">Delivery Fee:</span> ${vendor.vendorDeliveryFee}</p>
                                    <p><span className="font-medium">Rating:</span> {vendor.rating || 'No ratings yet'}</p>
                                </div>
                            </div>

                            {vendor.verificationDocument && (
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Verification Document</h3>
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                        <a
                                            href={vendor.verificationDocument.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                        >
                                            {vendor.verificationDocument.name || 'View Document'}
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onReject}
                            disabled={isLoading}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onVerify}
                            disabled={isLoading}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Verifying...' : 'Verify Vendor'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorVerificationModal; 