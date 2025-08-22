"use client";
import {
  ShoppingCart,
  User,
  FileText,
} from "lucide-react";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";
import Spinner from "../components/Spinner";
import Loading from "../loading";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FaShoppingBag } from 'react-icons/fa';


import AddressModeSelector from './components/AddressModeSelector';
import DeliveryForm from './components/DeliveryForm';
import SavedAddressesList from './components/SavedAddressesList';
import DeliverySchedule from './components/DeliverySchedule';
import OrderSummary from './components/OrderSummary';

const initialFormData = {
  name: "",
  phone: "",
  email: "",
  address: "",
  note: "",
  user: "",
  deliveryMode: "address",
  deliveryDate: null,
  deliveryTime: "",
};

const getMinTimeForDate = (date) => {
  if (!date) return undefined;
  
  const now = new Date();
  const selectedDate = new Date(date);
  const isToday = format(now, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
  
  if (!isToday) return undefined;
  
  // For today, ensure minimum time is at least 29 minutes from now
  const minTime = new Date(now.getTime() + 29 * 60000);
  const minutes = minTime.getMinutes();
  const roundedMinutes = Math.ceil(minutes / 5) * 5;
  minTime.setMinutes(roundedMinutes, 0, 0);
  
  return format(minTime, "HH:mm");
};

const getMinDate = () => {
  const now = new Date();
  return now;
};

const isTimeValidForDate = (time, date) => {
  if (!time || !date) return false;
  
  const now = new Date();
  const currentDate = format(now, "yyyy-MM-dd");
  const selectedDate = format(date, "yyyy-MM-dd");
  
  // If not today, any time is valid
  if (currentDate !== selectedDate) return true;
  
  // For today, check if time is at least 29 minutes in advance
  const [hours, minutes] = time.split(':').map(Number);
  const selectedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
  const minValidTime = new Date(now.getTime() + 29 * 60000);
  
  return selectedTime >= minValidTime;
};

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryFees, setDeliveryFees] = useState([]);
  const [tax, setTax] = useState(0);
  const [deliveryFeeLoading, setDeliveryFeeLoading] = useState(false);
  const [taxPercentage, setTaxPercentage] = useState(10);
  const [taxLoading, setTaxLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [user, setUser] = useState(null);
  const [jwt, setJwt] = useState("");
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addressesFetched, setAddressesFetched] = useState(false);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const now = new Date();
    const minTime = new Date(now.getTime() + 29 * 60000);
    
    const minutes = minTime.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    minTime.setMinutes(roundedMinutes, 0, 0);
    
    // Ensure the minimum time is valid (at least 29 minutes from now)
    const validDeliveryTime = minTime > now ? minTime : new Date(now.getTime() + 29 * 60000);
    
    setFormData(prev => ({
      ...prev,
      deliveryDate: now,
      deliveryTime: format(validDeliveryTime, "HH:mm")
    }));
    
    setLoading(false);
  }, []);

  // Validate delivery time every minute to ensure it's still valid
  useEffect(() => {
    if (!formData.deliveryDate || !formData.deliveryTime) return;
    
    const validateInterval = setInterval(() => {
      const now = new Date();
      const currentDate = format(now, "yyyy-MM-dd");
      const selectedDate = format(formData.deliveryDate, "yyyy-MM-dd");
      
      // If delivery is scheduled for today, check if time is still valid
      if (currentDate === selectedDate) {
        const [hours, minutes] = formData.deliveryTime.split(':').map(Number);
        const selectedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        const minValidTime = new Date(now.getTime() + 29 * 60000);
        
        if (selectedTime < minValidTime) {
          // Auto-adjust to next valid time
          const newMinTime = new Date(now.getTime() + 29 * 60000);
          const newMinutes = newMinTime.getMinutes();
          const newRoundedMinutes = Math.ceil(newMinutes / 5) * 5;
          newMinTime.setMinutes(newRoundedMinutes, 0, 0);
          
          setFormData(prev => ({
            ...prev,
            deliveryTime: format(newMinTime, "HH:mm")
          }));
          
          toast.info("Delivery time automatically adjusted to next available slot");
        }
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(validateInterval);
  }, [formData.deliveryDate, formData.deliveryTime]);

  const initializeAddressesField = useCallback(async () => {
    if (!user || !jwt) return;
    
    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await userResponse.json();
      if (!userData.id) {
        throw new Error("User ID not found");
      }
      setUserData(userData);
      if (userData.addresses === null) {
        const initResponse = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
              addresses: []
            }),
          }
        );
        
        if (initResponse.ok) {
          setSavedAddresses([]);
        }
      }
    } catch (error) {
    }
  }, [user, jwt]);

  const fetchSavedAddresses = useCallback(async () => {
    if (!user || !jwt || addressesFetched) return;
    
    try {
      setAddressesLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await response.json();
      
      // Set userData state so username and email are available for pickup mode
      setUserData(userData);
      
      let userAddresses = [];
      
      if (userData.addresses && Array.isArray(userData.addresses)) {
        userAddresses = userData.addresses;
      } else if (userData.data && userData.data.addresses && Array.isArray(userData.data.addresses)) {
        userAddresses = userData.data.addresses;
      } else if (userData.attributes && userData.attributes.addresses && Array.isArray(userData.attributes.addresses)) {
        userAddresses = userData.attributes.addresses;
      } else if (userData.address && Array.isArray(userData.address)) {
        userAddresses = userData.address;
      }
      
      if (!userAddresses) {
        userAddresses = [];
        try {
          const initResponse = await fetch(
            `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
              },
              body: JSON.stringify({
                addresses: []
              }),
            }
          );
          
          if (!initResponse.ok) {
          }
        } catch (initError) {
        }
      }
      
            setSavedAddresses(userAddresses);
      setAddressesFetched(true);
      
      if (userAddresses.length > 0) {
        if (formData.deliveryMode === 'saved-address' && !selectedAddressId) {
          setSelectedAddressId(userAddresses[0].id);
          // Load the first address data
          const firstAddress = userAddresses[0];
          setFormData(prev => ({
            ...prev,
            name: firstAddress.name,
            phone: firstAddress.phone,
            email: firstAddress.email || "",
            address: firstAddress.address,
          }))
        }
      }
    } catch (error) {
      toast.error("Failed to load saved addresses");
    } finally {
      setAddressesLoading(false);
    }
  }, [user, jwt, addressesFetched]);



  const handleAddressSelection = useCallback((addressId) => {
    const currentAddresses = Array.isArray(savedAddresses) ? savedAddresses : [];
    const address = currentAddresses.find(addr => addr.id === addressId);
    if (address) {
      setFormData(prev => ({
        ...prev,
        name: address.name,
        phone: address.phone,
        email: address.email || "",
        address: address.address,
      }));
      setSelectedAddressId(address.id);
    }
  }, [savedAddresses]);

  const handleAddressDeletion = useCallback(async (addressId) => {
    if (!user || !jwt) {
      toast.error("Please log in to manage addresses");
      return;
    }

    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await userResponse.json();
      if (!userData.id) {
        throw new Error("User ID not found");
      }

      const currentAddresses = Array.isArray(savedAddresses) ? savedAddresses : [];
      const updatedAddresses = currentAddresses.filter(addr => addr.id !== addressId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            addresses: updatedAddresses
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete address");
      }

      setSavedAddresses(updatedAddresses);
      
      if (selectedAddressId === addressId) {
        setFormData(prev => ({
          ...prev,
          name: "",
          phone: "",
          email: "",
          address: "",
        }));
        setSelectedAddressId(null);
      }
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address");
    }
  }, [user, jwt, savedAddresses, selectedAddressId]);
  const handleEditAddress = useCallback((address) => {
    setEditingAddress(address);
    setFormData(prev => ({
      ...prev,
      name: address.name,
      phone: address.phone,
      email: address.email || "",
      address: address.address,
    }));
    setSelectedAddressId(address.id);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingAddress(null);
    setFormData(prev => ({
      ...prev,
      name: "",
      phone: "",
      email: "",
      address: "",
    }));
    setSelectedAddressId(null);
    toast.info("Address editing cancelled");
  }, []);

  const handleUpdateAddress = useCallback(async () => {
    if (!editingAddress) return;
    
    if (!formData.name || formData.name.trim().length < 2) {
      toast.error("Please enter a valid name (at least 2 characters)");
      return;
    }
    
    if (!formData.phone || formData.phone.trim().length < 10) {
      toast.error("Please enter a valid phone number (at least 10 digits)");
      return;
    }
    
    if (!formData.address || formData.address.trim().length < 5) {
      toast.error("Please enter a valid address (at least 5 characters)");
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSavingAddress(true);

    try {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await userResponse.json();
      if (!userData.id) {
        throw new Error("User ID not found");
      }

      const updatedAddress = {
        ...editingAddress,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      };

      const currentAddresses = Array.isArray(savedAddresses) ? savedAddresses : [];
      const updatedAddresses = currentAddresses.map(addr => 
        addr.id === editingAddress.id ? updatedAddress : addr
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({
            addresses: updatedAddresses
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update address");
      }

      setSavedAddresses(updatedAddresses);
      setEditingAddress(null);
      toast.success("Address updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update address");
    } finally {
      setSavingAddress(false);
    }
  }, [editingAddress, formData, user, jwt, savedAddresses]);

  const saveCurrentAddress = useCallback(async () => {
    if (!formData.name) {
      toast.error("Please enter your name before saving");
      return;
    }
    
    if (!formData.phone) {
      toast.error("Please enter your phone number before saving");
      return;
    }
    
    if (!formData.address) {
      toast.error("Please enter your address before saving");
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      toast.error("Please enter a valid email address before saving");
      return;
    }

    if (!user || !jwt) {
      toast.error("Please log in to save addresses");
      return;
    }

    setSavingAddress(true);

    try {
      
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      
      const userData = await userResponse.json();
      if (!userData.id) {
        throw new Error("User ID not found");
      }

      const newAddress = {
        id: Date.now(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      };

      
      if (newAddress.name.length < 2) {
        throw new Error("Name must be at least 2 characters long");
      }
      
      if (newAddress.phone.length < 10) {
        throw new Error("Phone number must be at least 10 digits");
      }
      
      if (newAddress.address.length < 5) {
        throw new Error("Address must be at least 5 characters long");
      }

      if (!newAddress.email.includes('@')) {
        throw new Error("Please enter a valid email address");
      }

      
      const existingAddresses = Array.isArray(savedAddresses) ? savedAddresses : [];
      const isDuplicate = existingAddresses.some(addr => 
        addr.name.toLowerCase() === newAddress.name.toLowerCase() &&
        addr.phone === newAddress.phone &&
        addr.address.toLowerCase() === newAddress.address.toLowerCase()
      );
      
      if (isDuplicate) {
        throw new Error("This address is already saved");
      }

      
      const updatedAddresses = [...existingAddresses, newAddress];

      
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            addresses: updatedAddresses
          }),
        }
      );

      
      if (!response.ok) {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/users/${userData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
              addresses: updatedAddresses
            }),
          }
        );
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Failed to save address: ${response.status}`);
      }

      setSavedAddresses(updatedAddresses);
      setSelectedAddressId(newAddress.id);
      
      toast.success("Address saved successfully!");
      
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  }, [formData, savedAddresses, user, jwt, fetchSavedAddresses]);

  const handleAddNewAddress = useCallback(() => {
    setShowAddressForm(true);
    setEditingAddress(null);
    setSelectedAddressId(null);
    setFormData(prev => ({
      ...prev,
      name: "",
      phone: "",
      email: "",
      address: "",
    }));
    toast.info("Adding new address");
  }, []);

  const refreshAddresses = useCallback(async () => {
    if (!user || !jwt) return;
    
    setAddressesFetched(false);
    await fetchSavedAddresses();
  }, [user, jwt]);

  const handleModeChange = useCallback((mode) => {
    setFormData(prev => ({ ...prev, deliveryMode: mode }));
    
    if (mode === 'pickup') {
      setFormData(prev => ({
        ...prev,
        name: userData?.username || userData?.data?.username || userData?.attributes?.username || "",
        phone: "",
        email: userData?.email || userData?.data?.email || userData?.attributes?.email || "",
        address: "",
      }));
      setSelectedAddressId(null);
      setShowAddressForm(false);
      setEditingAddress(null);
    } else if (mode === 'address') {
      setFormData(prev => ({
        ...prev,
        name: "",
        phone: "",
        email: "",
        address: "",
      }));
      setSelectedAddressId(null);
      setShowAddressForm(false);
      setEditingAddress(null);
    } else if (mode === 'saved-address') {
      setShowAddressForm(false);
      setEditingAddress(null);
      
      if (savedAddresses.length > 0 && !selectedAddressId) {
        const firstAddress = savedAddresses[0];
        setSelectedAddressId(firstAddress.id);
        setFormData(prev => ({
          ...prev,
          name: firstAddress.name,
          phone: firstAddress.phone,
          email: firstAddress.email || "",
          address: firstAddress.address,
        }));
      }
    }
  }, [savedAddresses, selectedAddressId, userData]);



  const handleFormChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (['name', 'phone', 'address'].includes(name) && selectedAddressId) {
      setSelectedAddressId(null);
    }
  }, [selectedAddressId]);

  const handleDateChange = useCallback((date, minTime) => {
    if (!date) return;
    
    const now = new Date();
    const selectedDate = new Date(date);
    
    // Check if selected date is in the past
    if (selectedDate < new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
      toast.error("Cannot select a past date for delivery");
      return;
    }
    
    // If selecting today, ensure the current time is valid
    if (format(now, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      const currentTime = new Date();
      const minValidTime = new Date(currentTime.getTime() + 30 * 60000);
      
      if (selectedDate < minValidTime) {
        toast.error("Delivery must be scheduled at least 30 minutes in advance");
        return;
      }
    }
    
    // If changing to today and current time is invalid, adjust the time
    if (format(now, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      const currentTime = new Date();
      const minValidTime = new Date(currentTime.getTime() + 30 * 60000);
      const minutes = minValidTime.getMinutes();
      const roundedMinutes = Math.ceil(minutes / 5) * 5;
      minValidTime.setMinutes(roundedMinutes, 0, 0);
      
      minTime = format(minValidTime, "HH:mm");
    }
    
    setFormData(prev => ({
      ...prev,
      deliveryDate: date,
      deliveryTime: minTime || prev.deliveryTime,
    }));
    
    if (date) {
      const formattedDate = format(date, "EEEE, MMMM do, yyyy");
      toast.success(`Delivery scheduled for ${formattedDate}`);
    }
  }, []);

  const handleTimeChange = useCallback((time) => {
    if (!time) return;
    
    // Use the validation function
    if (!isTimeValidForDate(time, formData.deliveryDate)) {
      toast.error("Delivery time must be at least 30 minutes in advance");
      return;
    }
    
    setFormData(prev => ({ ...prev, deliveryTime: time }));
  }, [formData.deliveryDate]);

  const fetchTaxPercentage = useCallback(async () => {
    try {
      setTaxLoading(true);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/admin`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        setTaxPercentage(10);
        return;
      }
      
      const data = await response.json();
      
      let taxValue = 10; 
      
      if (data.data && data.data.taxPercentage !== undefined) {
        taxValue = Number(data.data.taxPercentage);
      } else if (data.taxPercentage !== undefined) {
        taxValue = Number(data.data.taxPercentage);
      } else if (data.data && data.data.attributes && data.data.attributes.taxPercentage !== undefined) {
        taxValue = Number(data.data.attributes.taxPercentage);
      }
      
      if (isNaN(taxValue) || taxValue < 0 || taxValue > 100) {
        taxValue = 10;
      }
      
      setTaxPercentage(taxValue);
      
    } catch (error) {
      setTaxPercentage(10);
    } finally {
      setTaxLoading(false);
    }
  }, []);



  const getAllVendorsDeliveryFees = async (cartItems) => {
    if (!cartItems.length) return;
    setDeliveryFeeLoading(true);
    try {
      const vendorIds = [
        ...new Set(cartItems.map((vendorGroup) => vendorGroup.vendorId)),
      ];
      const vendorDeliveryFees = await Promise.all(
        vendorIds.map(async (vendorId) => {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors/${vendorId}?fields[0]=vendorDeliveryFee&fields[1]=storeName`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (!res.ok) throw new Error("Failed to fetch vendor info");
            const data = await res.json();
            return {
              vendorId,
              storeName: data.data?.storeName || "Unknown Vendor",
              vendorDeliveryFee: Number(data.data?.vendorDeliveryFee) || 0,
            };
          } catch (error) {
            return {
              vendorId,
              storeName: "Unknown Vendor",
              vendorDeliveryFee: 0,
            };
          }
        })
      );
      setDeliveryFees(vendorDeliveryFees);
    } catch (error) {
      toast.error("Failed to load delivery fees. Please try again.");
    } finally {
      setDeliveryFeeLoading(false);
    }
  };



  useEffect(() => {
    const checkAuth = async () => {
      const userCookie = getCookie("user");
      const jwtCookie = getCookie("jwt");
      
      if (!userCookie || !jwtCookie) {
        toast.error("Please sign in to complete your order");
        router.push("/login");
        return;
      }
      
      setUser(userCookie);
      setJwt(jwtCookie);
      const storedZipCode = typeof window !== "undefined" ? (localStorage.getItem("zipcode") || "") : "";
      setFormData((prev) => ({ ...prev, user: userCookie }));
      
      // Load cart items directly instead of calling validateCart
      const storedCartItems = localStorage.getItem("cart");
      if (storedCartItems && JSON.parse(storedCartItems).length > 0) {
        const cartData = JSON.parse(storedCartItems);
        setCartItems(cartData);
      }
    };
    checkAuth();
    
    const taxTimeout = setTimeout(() => {
      if (taxLoading) {
        setTaxPercentage(10);
        setTaxLoading(false);
      }
    }, 5000); 
    
    fetchTaxPercentage().finally(() => {
      clearTimeout(taxTimeout);
    });
  }, [router, fetchTaxPercentage]);

  useEffect(() => {
    if (user && jwt && !addressesFetched) {
      fetchSavedAddresses();
    }
  }, [user, jwt, addressesFetched, fetchSavedAddresses]);

  useEffect(() => {
    if (user && jwt && savedAddresses === null && !addressesFetched) {
      initializeAddressesField();
    }
  }, [user, jwt, savedAddresses, addressesFetched, initializeAddressesField]);

  useEffect(() => {
    if (cartItems.length > 0) {
      getAllVendorsDeliveryFees(cartItems);
    } else {
      setDeliveryFees([]);
    }
  }, [cartItems]);


  const calculateSubtotal = useCallback(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((sum, vendor) => {
      const vendorTotal = vendor.dishes.reduce((dishSum, dish) => {
        const toppingsTotal = dish.toppings.reduce(
          (tSum, topping) => tSum + (Number(topping.price) || 0),
          0
        );
        const extrasTotal = dish.extras.reduce(
          (eSum, extra) => eSum + (Number(extra.price) || 0),
          0
        );
        return (
          dishSum +
          (Number(dish.basePrice) + toppingsTotal + extrasTotal) *
            Number(dish.quantity)
        );
      }, 0);
      return sum + vendorTotal;
    }, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    const calculatedSubtotal = calculateSubtotal();
    return Number(calculatedSubtotal.toFixed(2));
  }, [calculateSubtotal]);

  const calculatedTax = useMemo(() => {
    const effectiveTaxPercentage = taxPercentage && !isNaN(taxPercentage) ? taxPercentage : 10;
    return Number(((subtotal * effectiveTaxPercentage) / 100).toFixed(2));
  }, [subtotal, taxPercentage]);

  const totalDeliveryFee = useMemo(() => {
    if (formData.deliveryMode === 'pickup') {
      return 0;
    }
    return deliveryFees.reduce((a, b) => a + (b.vendorDeliveryFee || 0), 0);
  }, [deliveryFees, formData.deliveryMode]);

  const total = useMemo(() => {
    return Number((subtotal + calculatedTax + totalDeliveryFee).toFixed(2));
  }, [subtotal, calculatedTax, totalDeliveryFee]);

  useEffect(() => {
    if (calculatedTax !== tax) {
      setTax(calculatedTax);
    }
  }, [calculatedTax, tax]);

  // Auto-populate pickup fields when userData becomes available and pickup mode is selected
  useEffect(() => {
    if (formData.deliveryMode === 'pickup' && userData && Object.keys(userData).length > 0) {
      const username = userData?.username || userData?.data?.username  || "";
      const email = userData?.email || userData?.data?.email  || "";
      
      if (username || email) {
        setFormData(prev => ({
          ...prev,
          name: username,
          email: email,
        }));
      }
    }
  }, [userData, formData.deliveryMode]);

  const addOrder = useCallback(async (orderData) => {
    try {
      const user = getCookie("user");
      if (!user) {
        throw new Error("Authentication required");
      }
      
      const cleanOrderData = {
        ...orderData,
        user,
        note: orderData.note || "",
        deliveryType: orderData.deliveryType || "delivery",
        orderStatus: orderData.orderStatus || "pending",
        tax: Number(orderData.tax) || 0,
        totalTax: Number(orderData.totalTax) || 0,
        subtotal: Number(orderData.subtotal) || 0,
        totalAmount: Number(orderData.totalAmount) || 0,
        orderTotal: Number(orderData.orderTotal) || 0,
        deliveryFee: Number(orderData.deliveryFee) || 0,
        vendorDeliveryFee: Number(orderData.vendorDeliveryFee) || 0,
      };
      
      if (orderData.customerName !== undefined) {
        cleanOrderData.customerName = orderData.customerName || "";
      }
      if (orderData.phone !== undefined) {
        cleanOrderData.phone = orderData.phone || "";
      }
      if (orderData.address !== undefined) {
        cleanOrderData.address = orderData.address || "";
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
          },
          body: JSON.stringify({ data: cleanOrderData }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to place order");
      }
      return await response.json();
    } catch (error) {
      throw new Error(
        error.message || "Failed to place order. Please try again."
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const customerOrderId = new Date().getTime();
    
    try {
      const user = getCookie("user");
      if (!user) {
        toast.error("Please sign in to complete your order");
        router.push("/login");
        return;
      }

      // Validate delivery time before proceeding
      if (formData.deliveryDate && formData.deliveryTime) {
        if (!isTimeValidForDate(formData.deliveryTime, formData.deliveryDate)) {
          toast.error("Selected delivery time is no longer valid. Please select a new time.");
          setSubmitting(false);
          return;
        }
      }

      if (formData.deliveryMode === 'pickup') {
      } else {
        if (!formData.name || !formData.phone) {
          toast.error("Please fill in your name and phone number");
          setSubmitting(false);
          return;
        }
        
        if (formData.deliveryMode === 'address') {
          if (!formData.address) {
            toast.error("Please fill in your delivery address");
            setSubmitting(false);
            return;
          }
        } else if (formData.deliveryMode === 'saved-address') {
          if (!selectedAddressId && !formData.address) {
            toast.error("Please select a delivery address");
            setSubmitting(false);
            return;
          }
        }
      }

      const orderSubtotal = calculateSubtotal();
      const orderTax = Number(
        ((orderSubtotal * taxPercentage) / 100).toFixed(2)
      );
      const vendorProportions = cartItems.map((vendor) => {
        const vendorSubtotal = vendor.dishes.reduce((sum, dish) => {
          const toppingsTotal = dish.toppings.reduce(
            (tSum, topping) => tSum + (Number(topping.price) || 0),
            0
          );
          const extrasTotal = dish.extras.reduce(
            (eSum, extra) => eSum + (Number(extra.price) || 0),
            0
          );
          return (
            sum +
            (Number(dish.basePrice) + toppingsTotal + extrasTotal) *
              Number(dish.quantity)
          );
        }, 0);
        return {
          subtotal: vendorSubtotal,
          proportion: orderSubtotal > 0 ? vendorSubtotal / orderSubtotal : 0,
        };
      });
      
      const orderPromises = cartItems.map((vendor, index) => {
        const { subtotal: vendorSubtotal } = vendorProportions[index];
        const vendorTax = Number(
          ((vendorSubtotal * taxPercentage) / 100).toFixed(2)
        );
        const vendorFeeObj = deliveryFees.find(
          (fee) => fee.vendorId === vendor.vendorId
        );
        const vendorDeliveryFee = formData.deliveryMode === "pickup" 
          ? 0 
          : (vendorFeeObj ? vendorFeeObj.vendorDeliveryFee : 0);
        const vendorTotal = Number(
          (vendorSubtotal + vendorTax + vendorDeliveryFee).toFixed(2)
        );
        
        const orderData = {
          customerOrderId,
          note: formData.note || "",
          tax: vendorTax,
          totalTax: tax,
          subtotal: Number(vendorSubtotal.toFixed(2)),
          totalAmount: vendorTotal,
          orderTotal: total,
          deliveryFee: totalDeliveryFee,
          vendorDeliveryFee: vendorDeliveryFee,
          orderStatus: "pending",
          vendorId: vendor.vendorId || "",
          vendorName: vendor.storeName || vendor.vendorName || "Unknown Vendor",
          ...(vendor.vendorUsername && { vendorUsername: vendor.vendorUsername }),
          ...(vendor.vendorAvatar && { vendorAvatar: vendor.vendorAvatar }),
          dishes: vendor.dishes || [],
          deliveryDate: formData.deliveryDate
            ? format(formData.deliveryDate, "yyyy-MM-dd")
            : "",
          deliveryTime: formData.deliveryTime?.match(/^\d{2}:\d{2}$/)
            ? `${formData.deliveryTime}:00.000`
            : formData.deliveryTime || "",
        };

        if (formData.deliveryMode === "pickup") {
          orderData.deliveryType = "pickup";
          orderData.address = "Pickup";
          orderData.customerName = userData.username || "";
          orderData.user = userData.email || "";
        } else {
          orderData.customerName = formData.name || "";
          orderData.phone = formData.phone || "";
          // Get zipcode from localStorage and append to address
          const storedZipCode = typeof window !== "undefined" ? (localStorage.getItem("zipcode") || "") : "";
          orderData.address = storedZipCode ? `${formData.address || ""}, ${storedZipCode}` : formData.address || "";
          orderData.deliveryType = "delivery";
        }
        return addOrder(orderData);
      });
      
      await Promise.all(orderPromises);
      toast.success("Your order has been placed successfully!");
      localStorage.removeItem("cart");
      router.push(`/thank-you/${customerOrderId}`);
    } catch (error) {
      toast.error(error.message || "Unable to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <form onSubmit={handleSubmit} className="mx-3">
        <div className="w-full mx-auto pb-10 px-2 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 flex flex-col min-h-[600px] col-span-2 mb-6 md:mb-0">
            <h2 className="text-2xl font-black tracking-tight mb-8 text-rose-600 flex items-center gap-2">
              <ShoppingCart className="inline" />
              Checkout
            </h2>
            
            <AddressModeSelector
              selectedMode={formData.deliveryMode}
              onModeChange={handleModeChange}
            />
            
            <div className="mb-6 sm:mb-8">
              <h3 className="font-black text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 text-black flex items-center gap-2">
                <User className="inline w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /> Order Information
              </h3>
              
              {formData.deliveryMode === "address" && (
                <DeliveryForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  onSaveAddress={saveCurrentAddress}
                  onUpdateAddress={handleUpdateAddress}
                  onCancelEdit={handleCancelEdit}
                  editingAddress={editingAddress}
                  savingAddress={savingAddress}
                  selectedAddressId={selectedAddressId}
                  showSaveButton={false} 
                />
              )}
              
              {formData.deliveryMode === "saved-address" && (
                <>
                  <SavedAddressesList
                    savedAddresses={savedAddresses}
                    selectedAddressId={selectedAddressId}
                    onAddressSelection={handleAddressSelection}
                    onEditAddress={handleEditAddress}
                    onDeleteAddress={handleAddressDeletion}
                    onRefreshAddresses={refreshAddresses}
                    onAddNewAddress={handleAddNewAddress}
                    addressesLoading={addressesLoading}
                    showAddNewButton={true}
                  />
                  
                  {(showAddressForm || editingAddress) && (
                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                      <h4 className="font-black text-sm sm:text-base text-blue-900 mb-3 sm:mb-4 flex items-center gap-2">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </h4>
                      <DeliveryForm
                        formData={formData}
                        onFormChange={handleFormChange}
                        onSaveAddress={saveCurrentAddress}
                        onUpdateAddress={handleUpdateAddress}
                        onCancelEdit={handleCancelEdit}
                        editingAddress={editingAddress}
                        savingAddress={savingAddress}
                        selectedAddressId={selectedAddressId}
                        showSaveButton={true}
                      />
                    </div>
                  )}
                </>
              )}
              
              {formData.deliveryMode === "pickup" && (
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-flex flex-col items-center gap-3 px-6 sm:px-8 py-4 sm:py-6 bg-green-50 border-2 border-dashed border-green-300 rounded-xl">
                    <FaShoppingBag className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />
                    <div className="text-center">
                      <div className="font-semibold text-green-600 mb-1 text-sm sm:text-base">Pickup Order</div>
                      <div className="text-xs sm:text-sm text-green-500">You&apos;ll collect your order from the restaurant</div>
                      <div className="text-xs text-green-400 mt-2">No customer details required for pickup</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-4 sm:mt-6">
                <label className="block font-semibold text-xs sm:text-sm text-slate-500 pl-3 mb-2">
                  Note
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={(e) => handleFormChange('note', e.target.value)}
                  placeholder="Special instructions or notes for your order"
                  className="w-full px-3 sm:px-4 py-2 my-1 border rounded-lg sm:rounded-xl outline-rose-400 h-20 sm:h-24 resize-none text-sm sm:text-base"
                />
              </div>
            </div>
            
            <DeliverySchedule
              deliveryDate={formData.deliveryDate}
              deliveryTime={formData.deliveryTime}
              onDateChange={handleDateChange}
              onTimeChange={handleTimeChange}
              getMinTimeForDate={getMinTimeForDate}
              getMinDate={getMinDate}
            />
          </div>
          
          <OrderSummary
            subtotal={subtotal}
            tax={tax}
            deliveryFees={deliveryFees}
            totalDeliveryFee={totalDeliveryFee}
            total={total}
            submitting={submitting}
            onSubmit={handleSubmit}
            deliveryMode={formData.deliveryMode}
          />
        </div>
      </form>
    </LocalizationProvider>
  );
};

export default Page;