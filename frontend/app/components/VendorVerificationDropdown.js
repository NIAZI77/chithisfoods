"use client";

import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

const VendorVerificationDropdown = ({ vendor, onStatusChange }) => {
    const [isLoading, setIsLoading] = useState(false);

    const updateVerificationStatus = async (newStatus) => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/vendors?filters[documentId][$eq]=${vendor.documentId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
                    },
                    body: JSON.stringify({
                        data: {
                            verificationStatus: newStatus,
                        },
                    }),
                }
            );

            if (response.ok) {
                toast.success(`Vendor status updated to ${newStatus}`);
                if (onStatusChange) {
                    onStatusChange(newStatus);
                }
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating vendor status:", error);
            toast.error("Failed to update vendor status");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "verified":
                return "text-green-600 bg-green-50";
            case "unverified":
                return "text-yellow-600 bg-yellow-50";
            case "banned":
                return "text-red-600 bg-red-50";
            case "new-chef":
                return "text-blue-600 bg-blue-50";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`flex items-center gap-2 ${getStatusColor(
                        vendor.verificationStatus
                    )}`}
                    disabled={isLoading}
                >
                    {vendor.verificationStatus.charAt(0).toUpperCase() +
                        vendor.verificationStatus.slice(1).replace("-", " ")}
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("verified")}
                    className="text-green-600"
                >
                    Verified
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("unverified")}
                    className="text-yellow-600"
                >
                    Unverified
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("banned")}
                    className="text-red-600"
                >
                    Banned
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("new-chef")}
                    className="text-blue-600"
                >
                    New Chef
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default VendorVerificationDropdown; 