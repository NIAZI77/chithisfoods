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
    const [isLoading, setIsLoading] = useState(true);

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
        try {
            const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users`;
            const pagination = `pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`;
            const searchFilter = search ? `&filters[$or][0][username][$containsi]=${search}&filters[$or][1][email][$containsi]=${search}` : "";
            const statusFilter = filter !== "all" ? `&filters[blocked]=${filter === "blocked"}` : "";
            const sort = "sort=createdAt:desc";
            
            const apiUrl = `${baseUrl}?${pagination}${searchFilter}${statusFilter}&${sort}`;
            const headers = {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(apiUrl, { headers });
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            
            // Handle different possible response formats
            let usersData;
            if (Array.isArray(data)) {
                usersData = data;
            } else if (data.data) {
                usersData = Array.isArray(data.data) ? data.data : [data.data];
                // Update pagination info
                setTotalUsersPages(data.meta.pagination.pageCount);
            }

            if (!usersData || !Array.isArray(usersData)) {
                throw new Error('Invalid data format received from API');
            }

            setUsersList(usersData);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
            setUsersList([]);
        }
    };

    const fetchUsersForChart = async () => {
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
        }
    };

    const fetchVendors = async (page = 1, search = "", filter = "all") => {
        try {
            const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors`;
            const pagination = `pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`;
            const searchFilter = search ? `&filters[$or][0][storeName][$containsi]=${search}&filters[$or][1][email][$containsi]=${search}` : "";
            const statusFilter = filter !== "all" ? `&filters[isVerified]=${filter === "verified"}` : "";
            const sort = "sort=createdAt:desc";
            
            const apiUrl = `${baseUrl}?${pagination}${searchFilter}${statusFilter}&${sort}`;
            const headers = {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                'Content-Type': 'application/json',
            };

            const response = await fetch(apiUrl, { headers });
            
            if (!response.ok) {
                throw new Error('Failed to fetch vendors');
            }

            const data = await response.json();
            
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid data format received from API');
            }

            setVendorsList(data.data);
            setTotalVendorsPages(data.meta.pagination.pageCount);
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Failed to fetch vendors');
            setVendorsList([]);
        }
    };

    const fetchVendorsForChart = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?fields[0]=isVerified&pagination[limit]=9999999999&sort=createdAt:desc`, {
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch vendors chart data');
            }
            const data = await response.json();
            const vendorsData = Array.isArray(data) ? data : (data.data || []);
            setVendorsForChart(vendorsData);
        } catch (error) {
            console.error('Error fetching vendors chart data:', error);
            toast.error('Failed to fetch vendors chart data');
        }
    };

    // Initial data fetch
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
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
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Handle search and filter changes
    useEffect(() => {
        fetchUsers(currentUsersPage, usersSearchQuery, usersFilter);
    }, [currentUsersPage, usersSearchQuery, usersFilter]);

    useEffect(() => {
        fetchVendors(currentVendorsPage, vendorsSearchQuery, vendorsFilter);
    }, [currentVendorsPage, vendorsSearchQuery, vendorsFilter]);

    // Handle page changes
    const handleUsersPageChange = (page) => {
        setCurrentUsersPage(page);
    };

    const handleVendorsPageChange = (page) => {
        setCurrentVendorsPage(page);
    };

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

    // Update metrics calculation to use fetched data
    const metrics = {
        users: {
            total: usersForChart?.length || 0,
            blocked: usersForChart?.filter(user => user.blocked === true).length || 0,
        },
        vendors: {
            total: vendorsForChart?.length || 0,
            verified: vendorsForChart?.filter(vendor => vendor.isVerified === true).length || 0,
        },
    };

    const userChartData = [
        { name: 'Total Users', value: metrics.users.total },
        { name: 'Blocked Users', value: metrics.users.blocked },
    ];

    const vendorChartData = [
        { name: 'Total Vendors', value: metrics.vendors.total },
        { name: 'Verified Vendors', value: metrics.vendors.verified },
    ];

    // Update handleVerifyVendor to use Strapi API
    const handleVerifyVendor = async (vendorId) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        isVerified: true
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
                        ? { ...vendor, isVerified: true }
                        : vendor
                )
            );
            
            // Update chart data
            setVendorsForChart(prevVendors => 
                prevVendors.map(vendor => 
                    vendor.id === vendorId 
                        ? { ...vendor, isVerified: true }
                        : vendor
                )
            );

            toast.success('Vendor verified successfully');
        } catch (error) {
            console.error('Error verifying vendor:', error);
            toast.error('Failed to verify vendor');
        }
    };

    // Update handleBlockUser to use Strapi API
    const handleBlockUser = async (userId, currentBlockedStatus) => {
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
            toast.error('Failed to update user status');
        }
    };

    // Add a date formatting function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
    };

    if (isLoading) return <Loading />;

    return (
        <div className="p-4 pl-16 md:p-6 md:pl-24 lg:p-8 lg:pl-24 mx-auto max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl font-semibold">Users & Vendors Management</h1>
            </div>

            <MetricsCards metrics={metrics} />
            <Charts userChartData={userChartData} vendorChartData={vendorChartData} />

            <UsersTable
                users={usersList}
                onBlockUser={handleBlockUser}
                formatDate={formatDate}
                isLoading={isLoading}
                currentPage={currentUsersPage}
                totalPages={totalUsersPages}
                onPageChange={handleUsersPageChange}
                searchQuery={usersSearchQuery}
                onSearchChange={setUsersSearchQuery}
                onSearchSubmit={handleUsersSearch}
                filter={usersFilter}
                onFilterChange={setUsersFilter}
            />

            <VendorsTable
                vendors={vendorsList}
                onVerifyVendor={handleVerifyVendor}
                formatDate={formatDate}
                isLoading={isLoading}
                currentPage={currentVendorsPage}
                totalPages={totalVendorsPages}
                onPageChange={handleVendorsPageChange}
                searchQuery={vendorsSearchQuery}
                onSearchChange={setVendorsSearchQuery}
                onSearchSubmit={handleVendorsSearch}
                filter={vendorsFilter}
                onFilterChange={setVendorsFilter}
            />
        </div>
    );
};

export default UsersAndVendorsPage;
