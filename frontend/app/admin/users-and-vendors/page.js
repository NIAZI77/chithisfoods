"use client";

import React, { useState, useEffect } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import MetricsCards from "./components/MetricsCards";
import Charts from "./components/Charts";
import UsersTable from "./components/UsersTable";
import VendorsTable from "./components/VendorsTable";

const UsersAndVendorsPage = () => {
  const router = useRouter();

  const [usersList, setUsersList] = useState([]);
  const [usersForChart, setUsersForChart] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [vendorsForChart, setVendorsForChart] = useState([]);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isVendorsLoading, setIsVendorsLoading] = useState(false);
  const [isUsersChartLoading, setIsUsersChartLoading] = useState(false);
  const [isVendorsChartLoading, setIsVendorsChartLoading] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [currentVendorsPage, setCurrentVendorsPage] = useState(1);
  const [totalUsersPages, setTotalUsersPages] = useState(1);
  const [totalVendorsPages, setTotalVendorsPages] = useState(1);
  const itemsPerPage = 10;

  const [usersSearchQuery, setUsersSearchQuery] = useState("");
  const [vendorsSearchQuery, setVendorsSearchQuery] = useState("");
  const [usersFilter, setUsersFilter] = useState("all");
  const [vendorsFilter, setVendorsFilter] = useState("all");
  const [vendorsDocFilter, setVendorsDocFilter] = useState("all");

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (AdminJWT || AdminUser) {
      const isAdmin = async () => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${AdminJWT}`,
            },
          }
        );
        const data = await response.json();
        if (data.isAdmin) {
          return;
        } else {
          toast.error("Sorry, you don't have permission to access this page.");
          deleteCookie("AdminJWT");
          deleteCookie("AdminUser");
          router.push("/admin/login");
          return;
        }
      };
      isAdmin();
    } else {
      toast.error("Please sign in to continue.");
      router.push("/admin/login");
    }
  }, [router]);

  const fetchUsers = async (page = 1, search = "", filter = "all") => {
    setIsUsersLoading(true);
    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users`;
      const pagination = `pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`;
      const sort = "sort=createdAt:desc";

      const searchFilter = search
        ? `&filters[$or][0][username][$containsi]=${search}&filters[$or][1][email][$containsi]=${search}`
        : "";
      const statusFilter =
        filter !== "all" ? `&filters[blocked]=${filter === "blocked"}` : "";

      const apiUrl = `${baseUrl}?${pagination}&${sort}${searchFilter}${statusFilter}`;

      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();

      if (data.data && data.meta) {
        setUsersList(data.data);
        setTotalUsersPages(data.meta.pagination.pageCount);
      } else if (Array.isArray(data)) {
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);

        setUsersList(paginatedData);
        setTotalUsersPages(totalPages);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        error.message ||
          "We're having trouble loading user data right now. Please try again."
      );
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
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to fetch users chart data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const usersData = Array.isArray(data) ? data : data.data || [];

      if (!Array.isArray(usersData)) {
        console.error("Invalid data format received:", data);
        throw new Error("Invalid data format received from API");
      }

      const transformedData = usersData.map((user) => ({
        id: user.id,
        blocked: user.blocked,
      }));

      setUsersForChart(transformedData);
    } catch (error) {
      console.error("Error fetching users chart data:", {
        message: error.message,
        stack: error.stack,
      });
      toast.error(
        error.message ||
          "We're having trouble loading user chart data right now. Please try again."
      );
      setUsersForChart([]);
    } finally {
      setIsUsersChartLoading(false);
    }
  };

  const fetchVendors = async (
    page = 1,
    search = "",
    filter = "all",
    docFilter = "all"
  ) => {
    setIsVendorsLoading(true);
    try {
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors`;
      const pagination = `pagination[page]=${page}&pagination[pageSize]=${itemsPerPage}`;
      const sort = "sort=createdAt:desc";

      const searchFilter = search
        ? `&filters[$or][0][storeName][$containsi]=${search}&filters[$or][1][email][$containsi]=${search}`
        : "";

      let statusFilter = "";
      if (filter === "verified") {
        statusFilter = "&filters[verificationStatus][$eq]=verified";
      } else if (filter === "new") {
        statusFilter =
          "&filters[$or][0][verificationStatus][$eq]=new-chef&filters[$or][1][verificationStatus][$null]=true";
      } else if (filter === "unverified") {
        statusFilter = "&filters[verificationStatus][$eq]=unverified";
      } else if (filter === "banned") {
        statusFilter = "&filters[verificationStatus][$eq]=banned";
      } else if (filter === "rejected") {
        statusFilter = "&filters[verificationStatus][$eq]=rejected";
      } else if (filter === "pending_verification") {
        statusFilter =
          "&filters[$or][0][verificationStatus][$eq]=new-chef&filters[$or][1][verificationStatus][$eq]=unverified&filters[verificationDocument][$notNull]=true";
      }

      let documentFilter = "";
      if (docFilter === "with_docs") {
        documentFilter = "&filters[verificationDocument][$notNull]=true";
      } else if (docFilter === "without_docs") {
        documentFilter = "&filters[verificationDocument][$null]=true";
      }

      const apiUrl = `${baseUrl}?${pagination}&${sort}${searchFilter}${statusFilter}${documentFilter}&populate=*`;

      const headers = {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data = await response.json();

      if (data.data && data.meta) {
        const normalizedVendors = data.data.map((vendor) => ({
          ...vendor,
          verificationStatus: vendor.verificationStatus || "new-chef",
        }));
        setVendorsList(normalizedVendors);
        setTotalVendorsPages(data.meta.pagination.pageCount);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error(
        error.message ||
          "We're having trouble loading vendor data right now. Please try again."
      );
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
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("API Error Response:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        throw new Error(
          `Failed to fetch vendors chart data: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.data) {
        setVendorsForChart(data.data);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error("Error fetching vendors chart data:", {
        message: error.message,
        stack: error.stack,
      });
      toast.error(
        error.message ||
          "We're having trouble loading vendor chart data right now. Please try again."
      );
      setVendorsForChart([]);
    } finally {
      setIsVendorsChartLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setIsInitialLoading(true);
      try {
        if (
          !process.env.NEXT_PUBLIC_STRAPI_HOST ||
          !process.env.NEXT_PUBLIC_STRAPI_TOKEN
        ) {
          throw new Error("Missing required environment variables");
        }

        await Promise.all([
          fetchUsers(1, "", "all"),
          fetchUsersForChart(),
          fetchVendors(1, "", "all", "all"),
          fetchVendorsForChart(),
        ]);
      } catch (error) {
        console.error("Error in fetchAllData:", error);
        toast.error(
          error.message ||
            "We're having trouble loading data right now. Please try again."
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleUsersSearch = (e) => {
    e.preventDefault();
    setCurrentUsersPage(1);
    fetchUsers(1, usersSearchQuery, usersFilter);
  };

  const handleVendorsSearch = (e) => {
    e.preventDefault();
    setCurrentVendorsPage(1);
    fetchVendors(1, vendorsSearchQuery, vendorsFilter, vendorsDocFilter);
  };

  useEffect(() => {
    fetchUsers(currentUsersPage, "", usersFilter);
  }, [currentUsersPage, usersFilter]);

  useEffect(() => {
    fetchVendors(currentVendorsPage, "", vendorsFilter, vendorsDocFilter);
  }, [currentVendorsPage, vendorsFilter, vendorsDocFilter]);

  const handleUsersPageChange = (page) => {
    setCurrentUsersPage(page);
  };

  const handleVendorsPageChange = (page) => {
    setCurrentVendorsPage(page);
  };

  const handleUsersFilterChange = (newFilter) => {
    setUsersFilter(newFilter);
    setUsersSearchQuery("");
    setCurrentUsersPage(1);
    fetchUsers(1, "", newFilter);
  };

  const handleVendorsFilterChange = (newFilter) => {
    setVendorsFilter(newFilter);
    setVendorsSearchQuery("");
    setCurrentVendorsPage(1);
    fetchVendors(1, "", newFilter, vendorsDocFilter);
  };

  const handleVendorsDocFilterChange = (newDocFilter) => {
    setVendorsDocFilter(newDocFilter);
    setVendorsSearchQuery("");
    setCurrentVendorsPage(1);
    fetchVendors(1, "", vendorsFilter, newDocFilter);
  };

  const metrics = {
    users: {
      total: usersForChart?.length || 0,
      blocked:
        usersForChart?.filter((user) => user.blocked === true).length || 0,
    },
    vendors: {
      total: vendorsForChart?.length || 0,
      verified:
        vendorsForChart?.filter(
          (vendor) => vendor.verificationStatus === "verified"
        ).length || 0,
      newChefs:
        vendorsForChart?.filter(
          (vendor) =>
            vendor.verificationStatus === "new-chef" ||
            vendor.verificationStatus === null
        ).length || 0,
      unverified:
        vendorsForChart?.filter(
          (vendor) => vendor.verificationStatus === "unverified"
        ).length || 0,
      banned:
        vendorsForChart?.filter(
          (vendor) => vendor.verificationStatus === "banned"
        ).length || 0,
      rejected:
        vendorsForChart?.filter(
          (vendor) => vendor.verificationStatus === "rejected"
        ).length || 0,
    },
  };

  const userChartData = [
    { name: "Total Users", value: metrics.users.total },
    { name: "Blocked Users", value: metrics.users.blocked },
  ];

  const vendorChartData = [
    { name: "Total", value: metrics.vendors.total },
    { name: "Verified", value: metrics.vendors.verified },
    { name: "New", value: metrics.vendors.newChefs },
    { name: "Unverified", value: metrics.vendors.unverified },
    { name: "Banned", value: metrics.vendors.banned },
    { name: "Rejected", value: metrics.vendors.rejected },
  ];

  const handleVerifyVendor = async (documentId, newStatus) => {
    const validStatuses = [
      "verified",
      "unverified",
      "new-chef",
      "banned",
      "rejected",
    ];
    const statusTransitions = {
      "new-chef": ["verified", "unverified", "banned", "rejected"],
      unverified: ["verified", "banned", "rejected"],
      verified: ["banned", "unverified", "rejected"],
      banned: ["verified", "unverified", "rejected"],
      rejected: ["verified", "unverified", "banned"],
    };

    if (!documentId) {
      toast.error("Please provide a valid vendor ID to continue.");
      return;
    }

    if (!newStatus) {
      toast.error("Please select a verification status to continue.");
      return;
    }

    if (!validStatuses.includes(newStatus)) {
      toast.error(`Please select a valid status: ${validStatuses.join(", ")}`);
      return;
    }

    const currentVendor = vendorsList.find((v) => v.documentId === documentId);
    if (!currentVendor) {
      toast.error("We couldn't find that vendor. Please try again.");
      return;
    }

    const currentStatus = currentVendor.verificationStatus || "new-chef";

    if (!statusTransitions[currentStatus]?.includes(newStatus)) {
      toast.error(
        `Sorry, you cannot change the status from ${currentStatus} to ${newStatus}.`
      );
      return;
    }

    setIsStatusUpdating(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${documentId}`;

      const updateData = {
        data: {
          verificationStatus: newStatus,
        },
      };

      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        let errorMessage = "Failed to update vendor status";
        if (errorData?.error?.message) {
          errorMessage = errorData.error.message;
        } else if (response.status === 401) {
          errorMessage = "Authentication failed. Please check your API token.";
        } else if (response.status === 403) {
          errorMessage = "You do not have permission to update vendor status.";
        } else if (response.status === 404) {
          errorMessage = "Vendor not found.";
        } else if (response.status === 500) {
          errorMessage = "Server error occurred. Please try again later.";
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();

      if (!responseData.data) {
        throw new Error("Invalid response format from server");
      }

      const updatedVendor = responseData.data;

      setVendorsList((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.documentId === documentId
            ? {
                ...vendor,
                verificationStatus: newStatus,
              }
            : vendor
        )
      );

      setVendorsForChart((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor.documentId === documentId
            ? {
                ...vendor,
                verificationStatus: newStatus,
              }
            : vendor
        )
      );

      toast.success(`Excellent! Vendor has been ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating vendor status:", {
        error,
        message: error.message,
        stack: error.stack,
      });
      toast.error(
        error.message ||
          "We couldn't update the vendor status right now. Please try again."
      );
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const handleBlockUser = async (userId, currentBlockedStatus) => {
    setIsStatusUpdating(true);
    try {
      const user = usersList.find((u) => u.id === userId);
      let vendorBanResult = null;
      let vendorUnverifyResult = null;

      if (!currentBlockedStatus && user && user.email) {
        try {
          const encodedEmail = encodeURIComponent(user.email);
          const vendorRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          const vendorData = await vendorRes.json();
          const vendor = vendorData.data && vendorData.data[0];
          if (vendor && vendor.documentId) {
            const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendor.documentId}`;
            const updateData = {
              data: {
                verificationStatus: "banned",
              },
            };
            const response = await fetch(apiUrl, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateData),
            });
            if (!response.ok) {
              throw new Error("Failed to ban vendor account");
            }
            vendorBanResult = true;

            setVendorsList((prevVendors) =>
              prevVendors.map((vendorObj) =>
                vendorObj.documentId === vendor.documentId
                  ? { ...vendorObj, verificationStatus: "banned" }
                  : vendorObj
              )
            );
            setVendorsForChart((prevVendors) =>
              prevVendors.map((vendorObj) =>
                vendorObj.documentId === vendor.documentId
                  ? { ...vendorObj, verificationStatus: "banned" }
                  : vendorObj
              )
            );
          }
        } catch (err) {
          console.error("Error banning vendor account:", err);
        }
      }

      if (currentBlockedStatus && user && user.email) {
        try {
          const encodedEmail = encodeURIComponent(user.email);
          const vendorRes = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[email][$eq]=${encodedEmail}&populate=*`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
          const vendorData = await vendorRes.json();
          const vendor = vendorData.data && vendorData.data[0];
          if (vendor && vendor.documentId) {
            const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendor.documentId}`;
            const updateData = {
              data: {
                verificationStatus: "unverified",
              },
            };
            const response = await fetch(apiUrl, {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updateData),
            });
            if (!response.ok) {
              throw new Error("Failed to unverify vendor account");
            }
            vendorUnverifyResult = true;

            setVendorsList((prevVendors) =>
              prevVendors.map((vendorObj) =>
                vendorObj.documentId === vendor.documentId
                  ? { ...vendorObj, verificationStatus: "unverified" }
                  : vendorObj
              )
            );
            setVendorsForChart((prevVendors) =>
              prevVendors.map((vendorObj) =>
                vendorObj.documentId === vendor.documentId
                  ? { ...vendorObj, verificationStatus: "unverified" }
                  : vendorObj
              )
            );
          }
        } catch (err) {
          console.error("Error unverifying vendor account:", err);
        }
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blocked: !currentBlockedStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      setUsersList((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, blocked: !currentBlockedStatus }
            : user
        )
      );

      setUsersForChart((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, blocked: !currentBlockedStatus }
            : user
        )
      );

      toast.success(
        `Great! User has been ${
          currentBlockedStatus ? "unblocked" : "blocked"
        } successfully${
          vendorBanResult ? " (Vendor account also banned)" : ""
        }${vendorUnverifyResult ? " (Vendor account set to unverified)" : ""}`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error(
        error.message ||
          "We couldn't update the user status right now. Please try again."
      );
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
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
        onVerifyVendor={handleVerifyVendor}
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
        docFilter={vendorsDocFilter}
        onDocFilterChange={handleVendorsDocFilterChange}
      />
    </div>
  );
};

export default UsersAndVendorsPage;
