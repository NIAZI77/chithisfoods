"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import Pagination from "@/app/admin/users-and-vendors/components/Pagination";
import { customScrollbarStyles } from "./constants";
import MetricsCards from "./components/MetricsCards";
import Filters from "./components/Filters";
import OrdersTable from "./components/OrdersTable";

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [fullOrders, setFullOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [vendorPaymentStatus, setVendorPaymentStatus] = useState("all");
  const [timeFilter, setTimeFilter] = useState("this-week");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const AdminJWT = getCookie("AdminJWT");
    const AdminUser = getCookie("AdminUser");

    if (!AdminJWT || !AdminUser) {
      toast.error("Please login to continue.");
      router.push("/admin/login");
    }
  }, []);

  const orderMetrics = useMemo(() => ({
    total: fullOrders.length,
    delivered: fullOrders.filter(order => order.orderStatus === "delivered").length,
    refunded: fullOrders.filter(order =>
      order.orderStatus === "refunded" || order.orderStatus === "cancelled"
    ).length,
    totalMoney: fullOrders
      .reduce((sum, order) => sum + parseFloat(order.totalAmount || 0), 0)
      .toFixed(2),
    uncompletedOrders: fullOrders
      .filter(order =>
        order.orderStatus !== "delivered" &&
        order.orderStatus !== "cancelled"
      ).length,
  }), [fullOrders]);

  const fetchOrders = async (page = 1, orderStatus = "all", vendorPayment = "all", timeFilter = "all-time") => {
    try {
      setLoading(true);
      setError(null);

      const pageSize = 20;
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const pagination = `pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const sort = "sort[0]=createdAt:desc";

      let filters = [];

      if (timeFilter !== "all-time") {
        const currentDate = new Date();
        let startDate;

        if (timeFilter === "this-week") {
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
        } else if (timeFilter === "this-month") {
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 1);
        }

        if (startDate) {
          filters.push(`filters[createdAt][$gte]=${startDate.toISOString()}`);
          filters.push(`filters[createdAt][$lte]=${currentDate.toISOString()}`);
        }
      }

      if (orderStatus !== "all") {
        filters.push(`filters[orderStatus][$eq]=${orderStatus}`);
      }

      if (vendorPayment !== "all") {
        filters.push(`filters[vendor_payment][$eq]=${vendorPayment}`);
      }

      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?${sort}&${pagination}${filtersString}`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from API');
      }

      setOrders(data.data);
      setTotalPages(data.meta.pagination.pageCount);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const fetchFullOrders = async (timeFilter = "all-time") => {
    try {
      setLoading(true);
      const baseUrl = `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`;
      const sort = "sort[0]=createdAt:desc";

      let filters = [];

      if (timeFilter !== "all-time") {
        const currentDate = new Date();
        let startDate;

        if (timeFilter === "this-week") {
          startDate = new Date(currentDate);
          startDate.setDate(currentDate.getDate() - 7);
        } else if (timeFilter === "this-month") {
          startDate = new Date(currentDate);
          startDate.setMonth(currentDate.getMonth() - 1);
        }

        if (startDate) {
          filters.push(`filters[createdAt][$gte]=${startDate.toISOString()}`);
          filters.push(`filters[createdAt][$lte]=${currentDate.toISOString()}`);
        }
      }

      const filtersString = filters.length > 0 ? `&${filters.join('&')}` : '';
      const apiUrl = `${baseUrl}?fields[0]=orderStatus&fields[1]=totalAmount&${sort}${filtersString}&pagination[limit]=9999999999`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid data format received from API');
      }

      setFullOrders(data.data);

    } catch (err) {
      setError(err.message);
      console.error("Error fetching orders:", err);
      setFullOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterStatusChange = (newStatus) => {
    setFilterStatus(newStatus);
    setCurrentPage(1);
    fetchOrders(1, newStatus, vendorPaymentStatus, timeFilter);
  };

  const handleVendorPaymentChange = (newStatus) => {
    setVendorPaymentStatus(newStatus);
    setCurrentPage(1);
    fetchOrders(1, filterStatus, newStatus, timeFilter);
  };

  const handleTimeFilterChange = (newFilter) => {
    setTimeFilter(newFilter);
    setCurrentPage(1);
    fetchOrders(1, filterStatus, vendorPaymentStatus, newFilter);
    fetchFullOrders(newFilter);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchOrders(page, filterStatus, vendorPaymentStatus, timeFilter);
  };

  useEffect(() => {
    fetchOrders(currentPage, filterStatus, vendorPaymentStatus, timeFilter);
    fetchFullOrders(timeFilter);
  }, [currentPage, timeFilter, filterStatus, vendorPaymentStatus]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 rounded-xl pl-20">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 rounded-xl !pl-20">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 my-4 sm:my-5">Orders</h1>

        <MetricsCards orderMetrics={orderMetrics} />

        <Filters
          timeFilter={timeFilter}
          filterStatus={filterStatus}
          vendorPaymentStatus={vendorPaymentStatus}
          onTimeFilterChange={handleTimeFilterChange}
          onFilterStatusChange={handleFilterStatusChange}
          onVendorPaymentChange={handleVendorPaymentChange}
        />

        <OrdersTable orders={orders} />

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default OrdersPage;
