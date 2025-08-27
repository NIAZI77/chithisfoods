"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Percent, Save, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const TaxPercentage = () => {
  const [taxPercentage, setTaxPercentage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [originalValue, setOriginalValue] = useState(10);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    fetchTaxPercentage();
  }, []);

  const fetchTaxPercentage = async () => {
    try {
      setIsLoading(true);
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
        throw new Error('Failed to fetch tax percentage');
      }

      const data = await response.json();
      
      // Check if admin data exists
      if (!data.data) {
        await createDefaultTaxPercentage();
        return;
      }

      const currentTaxPercentage = data.data.taxPercentage || 0;
      
      setTaxPercentage(currentTaxPercentage);
      setOriginalValue(currentTaxPercentage);
      setAdminId(data.data.id);
    } catch (error) {
      console.error('Error fetching tax percentage:', error);
      toast.error('We\'re having trouble loading the tax percentage. Using default value.');
      setTaxPercentage(10);
      setOriginalValue(10);
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultTaxPercentage = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/admin`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              taxPercentage: 10
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create default tax percentage');
      }

      const data = await response.json();
      setTaxPercentage(10);
      setOriginalValue(10);
      setAdminId(data.data.id);
      toast.success('Great! Default tax percentage has been created successfully');
    } catch (error) {
      console.error('Error creating default tax percentage:', error);
      toast.error('We couldn\'t create the default tax percentage right now. Please try again.');
      setTaxPercentage(10);
      setOriginalValue(10);
    }
  };

  const handleTaxChange = (e) => {
    const value = e.target.value;
    
    // Allow empty string for better UX
    if (value === '') {
      setTaxPercentage('');
      return;
    }
    
    // Only allow digits
    if (!/^\d+$/.test(value)) {
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    // Validate range 0-100
    if (numValue < 0 || numValue > 100) {
      return;
    }
    
    setTaxPercentage(numValue);
  };

  const handleSave = async () => {
    // Validate that we have a valid integer value
    if (taxPercentage === '' || isNaN(taxPercentage) || taxPercentage < 0 || taxPercentage > 100) {
      toast.error('Please enter a valid tax percentage between 0 and 100');
      return;
    }

    if (taxPercentage === originalValue) {
      toast.info('No changes to save');
      return;
    }

    try {
      setIsSaving(true);
      
      if (!adminId) {
        // Create new admin record if none exists
        await createDefaultTaxPercentage();
        return;
      }

      // Update the admin record
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_HOST}/api/admin`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: {
              taxPercentage: parseInt(taxPercentage, 10)
            }
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error('Failed to update tax percentage');
      }

      setOriginalValue(taxPercentage);
      toast.success('Perfect! Tax percentage has been updated successfully');
    } catch (error) {
      console.error('Error updating tax percentage:', error);
      toast.error('We couldn\'t update the tax percentage right now. Please try again.');
      setTaxPercentage(originalValue); // Revert to original value
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = taxPercentage !== originalValue;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Tax Percentage
          </CardTitle>
          <CardDescription>
            Configure the tax percentage applied to all orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-pink-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="w-5 h-5 text-pink-600" />
          Tax Percentage
        </CardTitle>
        <CardDescription>
          Configure the tax percentage applied to all orders (0-100%)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="taxPercentage" className="text-sm font-medium">
            Tax Percentage (%)
          </Label>
          <div className="relative">
            <Input
              id="taxPercentage"
              type="text"
              value={taxPercentage}
              onChange={handleTaxChange}
              className="pr-8"
              placeholder="Enter tax percentage"
              maxLength={3}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 text-sm">%</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white transition-colors"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>

        {hasChanges && (
          <p className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
            ⚠️ Changes will affect all future orders. Current orders will not be affected.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxPercentage; 