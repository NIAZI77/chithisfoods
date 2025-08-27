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
import VerificationBadge from "./VerificationBadge";

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
                toast.success(`Great! Vendor status has been updated to ${newStatus}`);
                if (onStatusChange) {
                    onStatusChange(newStatus);
                }
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating vendor status:", error);
            toast.error("We couldn't update the vendor status right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 p-2"
                    disabled={isLoading}
                >
                    <VerificationBadge status={vendor.verificationStatus} size="small" />
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("verified")}
                    className="flex items-center gap-2"
                >
                    <VerificationBadge status="verified" size="small" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("unverified")}
                    className="flex items-center gap-2"
                >
                    <VerificationBadge status="unverified" size="small" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("banned")}
                    className="flex items-center gap-2"
                >
                    <VerificationBadge status="banned" size="small" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("new-chef")}
                    className="flex items-center gap-2"
                >
                    <VerificationBadge status="new-chef" size="small" />
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => updateVerificationStatus("rejected")}
                    className="flex items-center gap-2"
                >
                    <VerificationBadge status="rejected" size="small" />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default VendorVerificationDropdown; 