"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { usePathname, useRouter } from "next/navigation";

const ZIPCODE_REGEX = /^\d{5}$/;
const ZIPCODE_MAX_LENGTH = 5;

export default function ZipcodeDialogue() {
  const [zipcode, setZipcode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedZipcode = localStorage.getItem("zipcode");
    if (savedZipcode) {
      setZipcode(savedZipcode);
    }
  }, []);

  const validateZipcode = useCallback((code) => {
    return ZIPCODE_REGEX.test(code);
  }, []);

  const handleZipcodeChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, ZIPCODE_MAX_LENGTH);
    setZipcode(value);
    setError("");
  }, []);

  const handleSaveZipcode = useCallback(() => {
    if (!zipcode) {
      setError("Please enter a zipcode");
      toast.error("Enter zipcode to continue");
      return;
    }

    if (!validateZipcode(zipcode)) {
      setError("Please enter a valid 5-digit zipcode");
      toast.error("Invalid zipcode format");
      return;
    }

    try {
      localStorage.clear();
      localStorage.setItem("zipcode", zipcode);
      window.dispatchEvent(new CustomEvent("zipcodeChange", {
        detail: { zipcode }
      }));
      setIsOpen(false);
      router.push("/explore");
    } catch (error) {
      toast.error("Update failed");
      console.error("Error saving zipcode:", error);
    }
  }, [zipcode, validateZipcode, router]);

  const buttonText = pathname === "/" ? "Explore Chef Services" : "Change Location";
  const buttonClass = pathname === "/" 
    ? "uppercase w-full mt-8 px-8 py-3 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold transition-all block"
    : "bg-green-400 text-white md:px-4 px-2 md:py-3 py-1.5 rounded-full shadow-md hover:bg-green-500 transition-all font-semibold";

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button className={buttonClass}>
          {buttonText}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="mx-auto sm:mx-0 mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-rose-100">
              <MapPin className="h-5 w-5 text-rose-600" />
            </div>
            Enter Your Zipcode
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md text-gray-600">
            Let us find the best chefs in your area
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-1">
          <input
            type="text"
            placeholder="Enter zipcode"
            value={zipcode}
            onChange={handleZipcodeChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <button className="hover:bg-gray-100">Cancel</button>
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSaveZipcode}
            className="px-6 bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all font-semibold"
            disabled={zipcode.length < ZIPCODE_MAX_LENGTH}
          >
            Find Chefs
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
