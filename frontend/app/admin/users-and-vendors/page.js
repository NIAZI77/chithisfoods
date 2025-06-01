"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import MetricsCards from "./components/MetricsCards";
import Charts from "./components/Charts";
import UsersTable from "./components/UsersTable";
import VendorsTable from "./components/VendorsTable";

const UsersAndVendorsPage = () => {
    // State management
    const [usersList, setUsersList] = useState([]);
    const [usersForChart, setUsersForChart] = useState([]);
    const [vendorsList, setVendorsList] = useState([]);
    const [vendorsForChart, setVendorsForChart] = useState([]);

    // Separate loading states for different operations
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isVendorsLoading, setIsVendorsLoading] = useState(false);
    const [isUsersChartLoading, setIsUsersChartLoading] = useState(false);
    const [isVendorsChartLoading, setIsVendorsChartLoading] = useState(false);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

    // Pagination state
    const [currentUsersPage, setCurrentUsersPage] = useState(1);
    const [currentVendorsPage, setCurrentVendorsPage] = useState(1);
    const [totalUsersPages, setTotalUsersPages] = useState(1);
    const [totalVendorsPages, setTotalVendorsPages] = useState(1);
    const itemsPerPage = 10;

    // Search and filter state
    const [usersSearchQuery, setUsersSearchQuery] = useState("");
    const [vendorsSearchQuery, setVendorsSearchQuery] = useState("");
    const [usersFilter, setUsersFilter] = useState("all"); // all, active, blocked
    const [vendorsFilter, setVendorsFilter] = useState("all"); // all, verified, new

    // Fetch functions using Strapi APIs
    const fetchUsers = async (page = 1, search = "", filter = "all") => {
        setIsUsersLoading(true);
        try {
            const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users`;
            const pagination = `pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`;
            const sort = "sort=createdAt:desc";
            
            // Simple search filter
            const searchFilter = search ? `&filters[$or][0][username][$containsi]=${search}&filters[$or][1][email][$containsi]=${search}` : "";
            const statusFilter = filter !== "all" ? `&filters[blocked]=${filter === "blocked"}` : "";
            
            const apiUrl = `${baseUrl}?${pagination}&${sort}${searchFilter}${statusFilter}`;
            
            const headers = {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(apiUrl, { headers });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            
            // Handle both Strapi v4 and direct array responses
            if (data.data && data.meta) {
                // Strapi v4 response format
                setUsersList(data.data);
                setTotalUsersPages(data.meta.pagination.pageCount);
            } else if (Array.isArray(data)) {
                // Direct array response - calculate pagination manually
                const totalItems = data.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedData = data.slice(startIndex, endIndex);
                
                setUsersList(paginatedData);
                setTotalUsersPages(totalPages);
            } else {
                throw new Error('Invalid data format received from API');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error(error.message || 'Failed to fetch users');
            setUsersList([]);
            setTotalUsersPages(1);
        } finally {
            setIsUsersLoading(false);
        }
    };

    const fetchUsersForChart = async () => {
        setIsUsersChartLoading(true);
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users?fields[0]=blocked&pagination[limit]=99999999999&sort=createdAt:desc`;
            const headers = {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(apiUrl, { headers });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData
                });
                throw new Error(`Failed to fetch users chart data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            // Handle both direct array response and Strapi-style response
            const usersData = Array.isArray(data) ? data : (data.data || []);

            if (!Array.isArray(usersData)) {
                console.error('Invalid data format received:', data);
                throw new Error('Invalid data format received from API');
            }

            // Transform the data to ensure we have the correct structure
            const transformedData = usersData.map(user => ({
                id: user.id,
                blocked: user.blocked
            }));

            setUsersForChart(transformedData);
        } catch (error) {
            console.error('Error fetching users chart data:', {
                message: error.message,
                stack: error.stack
            });
            toast.error(error.message || 'Failed to fetch users chart data');
            setUsersForChart([]);
        } finally {
            setIsUsersChartLoading(false);
        }
    };

    const fetchVendors = async (page = 1, search = "", filter = "all") => {
        setIsVendorsLoading(true);
        try {
            const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors`;
            const pagination = `pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`;
            const sort = "sort=createdAt:desc";
            
            // Simple search filter
            const searchFilter = search ? `&filters[$or][0][storeName][$containsi]=${search}&filters[$or][1][email][$containsi]=${search}` : "";
            
            // Updated status filter for vendors
            let statusFilter = "";
            if (filter === "verified") {
                statusFilter = "&filters[verificationStatus][$eq]=verified";
            } else if (filter === "new") {
                statusFilter = "&filters[verificationStatus][$eq]=new-chef";
            } else if (filter === "unverified") {
                statusFilter = "&filters[verificationStatus][$eq]=unverified";
            }
            
            const apiUrl = `${baseUrl}?${pagination}&${sort}${searchFilter}${statusFilter}&populate=*`;
            
            const headers = {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(apiUrl, { headers });
            
            if (!response.ok) {
                throw new Error('Failed to fetch vendors');
            }

            const data = await response.json();
            
            // Handle both Strapi v4 and direct array responses
            if (data.data && data.meta) {
                // Strapi v4 response format
                setVendorsList(data.data);
                setTotalVendorsPages(data.meta.pagination.pageCount);
            } else if (Array.isArray(data)) {
                // Direct array response - calculate pagination manually
                const totalItems = data.length;
                const totalPages = Math.ceil(totalItems / itemsPerPage);
                const startIndex = (page - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage;
                const paginatedData = data.slice(startIndex, endIndex);
                
                setVendorsList(paginatedData);
                setTotalVendorsPages(totalPages);
            } else {
                throw new Error('Invalid data format received from API');
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error(error.message || 'Failed to fetch vendors');
            setVendorsList([]);
            setTotalVendorsPages(1);
        } finally {
            setIsVendorsLoading(false);
        }
    };

    const fetchVendorsForChart = async () => {
        setIsVendorsChartLoading(true);
        try {
            const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?fields[0]=verificationStatus&pagination[limit]=9999999999&sort=createdAt:desc`;
            const headers = {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(apiUrl, { headers });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error('API Error Response:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorData
                });
                throw new Error(`Failed to fetch vendors chart data: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Handle both direct array response and Strapi-style response
            const vendorsData = Array.isArray(data) ? data : (data.data || []);

            if (!Array.isArray(vendorsData)) {
                console.error('Invalid data format received:', data);
                throw new Error('Invalid data format received from API');
            }

            // Transform the data to ensure we have the correct structure
            const transformedData = vendorsData.map(vendor => ({
                id: vendor.id,
                verificationStatus: vendor.attributes?.verificationStatus || vendor.verificationStatus || 'unverified'
            }));

            setVendorsForChart(transformedData);
        } catch (error) {
            console.error('Error fetching vendors chart data:', {
                message: error.message,
                stack: error.stack
            });
            toast.error(error.message || 'Failed to fetch vendors chart data');
            setVendorsForChart([]);
        } finally {
            setIsVendorsChartLoading(false);
        }
    };

    // Initial data fetch
    useEffect(() => {
        const fetchAllData = async () => {
            setIsInitialLoading(true);
            try {
                if (!process.env.NEXT_PUBLIC_STRAPI_HOST || !process.env.NEXT_PUBLIC_STRAPI_TOKEN) {
                    throw new Error('Missing required environment variables');
                }

                await Promise.all([
                    fetchUsers(1, "", "all"),
                    fetchUsersForChart(),
                    fetchVendors(1, "", "all"),
                    fetchVendorsForChart()
                ]);
            } catch (error) {
                console.error('Error in fetchAllData:', error);
                toast.error(error.message || 'Failed to fetch data');
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Handle search submissions
    const handleUsersSearch = (e) => {
        e.preventDefault();
        setCurrentUsersPage(1);
        fetchUsers(1, usersSearchQuery, usersFilter);
    };

    const handleVendorsSearch = (e) => {
        e.preventDefault();
        setCurrentVendorsPage(1);
        fetchVendors(1, vendorsSearchQuery, vendorsFilter);
    };

    // Remove the useEffect for search changes
    useEffect(() => {
        fetchUsers(currentUsersPage, "", usersFilter);
    }, [currentUsersPage, usersFilter]);

    useEffect(() => {
        fetchVendors(currentVendorsPage, "", vendorsFilter);
    }, [currentVendorsPage, vendorsFilter]);

    // Handle page changes
    const handleUsersPageChange = (page) => {
        setCurrentUsersPage(page);
    };

    const handleVendorsPageChange = (page) => {
        setCurrentVendorsPage(page);
    };

    // Handle filter changes
    const handleUsersFilterChange = (newFilter) => {
        setUsersFilter(newFilter);
        setUsersSearchQuery(""); // Clear search when filter changes
        setCurrentUsersPage(1); // Reset to first page
        fetchUsers(1, "", newFilter); // Fetch with empty search
    };

    const handleVendorsFilterChange = (newFilter) => {
        setVendorsFilter(newFilter);
        setVendorsSearchQuery(""); // Clear search when filter changes
        setCurrentVendorsPage(1); // Reset to first page
        fetchVendors(1, "", newFilter); // Fetch with empty search
    };

    // Update metrics calculation to use fetched data
    const metrics = {
        users: {
            total: usersForChart?.length || 0,
            blocked: usersForChart?.filter(user => user.blocked === true).length || 0,
        },
        vendors: {
            total: vendorsForChart?.length || 0,
            verified: vendorsForChart?.filter(vendor => vendor.verificationStatus === 'verified').length || 0,
            newChefs: vendorsForChart?.filter(vendor => vendor.verificationStatus === 'new-chef').length || 0,
            unverified: vendorsForChart?.filter(vendor => vendor.verificationStatus === 'unverified').length || 0,
        },
    };

    const userChartData = [
        { name: 'Total Users', value: metrics.users.total },
        { name: 'Blocked Users', value: metrics.users.blocked },
    ];

    const vendorChartData = [
        { name: 'Total', value: metrics.vendors.total },
        { name: 'Verified', value: metrics.vendors.verified },
        { name: 'New', value: metrics.vendors.newChefs },
        { name: 'Unverified', value: metrics.vendors.unverified },
    ];

    // Update handleVerifyVendor to use new status values
    const handleVerifyVendor = async (vendorId) => {
        setIsStatusUpdating(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        verificationStatus: "verified"
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to verify vendor');
            }

            // Update local state after successful API call
            setVendorsList(prevVendors =>
                prevVendors.map(vendor =>
                    vendor.id === vendorId
                        ? { ...vendor, verificationStatus: "verified" }
                        : vendor
                )
            );

            // Update chart data
            setVendorsForChart(prevVendors =>
                prevVendors.map(vendor =>
                    vendor.id === vendorId
                        ? { ...vendor, verificationStatus: "verified" }
                        : vendor
                )
            );

            toast.success('Vendor verified successfully');
        } catch (error) {
            console.error('Error verifying vendor:', error);
            toast.error(error.message || 'Failed to verify vendor');
        } finally {
            setIsStatusUpdating(false);
        }
    };

    // Update handleBlockUser to use Strapi API
    const handleBlockUser = async (userId, currentBlockedStatus) => {
        setIsStatusUpdating(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    blocked: !currentBlockedStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update user status');
            }

            // Update local state after successful API call
            setUsersList(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, blocked: !currentBlockedStatus }
                        : user
                )
            );

            // Update chart data
            setUsersForChart(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId
                        ? { ...user, blocked: !currentBlockedStatus }
                        : user
                )
            );

            toast.success(`User ${currentBlockedStatus ? 'unblocked' : 'blocked'} successfully`);
        } catch (error) {
            console.error('Error updating user status:', error);
            toast.error(error.message || 'Failed to update user status');
        } finally {
            setIsStatusUpdating(false);
        }
    };

    // Add a date formatting function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    if (isInitialLoading) return <Loading />;

    return (
        <div className="p-4 pl-16 md:p-6 md:pl-24 lg:p-8 lg:pl-24 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-semibold">Users & Vendors Management</h1>
            </div>

            <MetricsCards
                metrics={metrics}
                isLoading={isUsersChartLoading || isVendorsChartLoading}
            />
            <Charts
                userChartData={userChartData}
                vendorChartData={vendorChartData}
                isLoading={isUsersChartLoading || isVendorsChartLoading}
            />

            <UsersTable
                users={usersList}
                onBlockUser={handleBlockUser}
                formatDate={formatDate}
                isLoading={isUsersLoading || isStatusUpdating}
                currentPage={currentUsersPage}
                totalPages={totalUsersPages}
                onPageChange={handleUsersPageChange}
                searchQuery={usersSearchQuery}
                onSearchChange={setUsersSearchQuery}
                onSearchSubmit={handleUsersSearch}
                filter={usersFilter}
                onFilterChange={handleUsersFilterChange}
            />

            <VendorsTable
                vendors={vendorsList}
                onVerifyVendor={handleVerifyVendor}
                formatDate={formatDate}
                isLoading={isVendorsLoading || isStatusUpdating}
                currentPage={currentVendorsPage}
                totalPages={totalVendorsPages}
                onPageChange={handleVendorsPageChange}
                searchQuery={vendorsSearchQuery}
                onSearchChange={setVendorsSearchQuery}
                onSearchSubmit={handleVendorsSearch}
                filter={vendorsFilter}
                onFilterChange={handleVendorsFilterChange}
            />
        </div>
    );
};

export default UsersAndVendorsPage;
