"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function EmailConfirmationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("confirmation");
  const [status, setStatus] = useState("loading"); // 'loading', 'success', 'error'

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/email-confirmation?confirmation=${token}`
        );
        if (res.ok) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verifying your email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600">
              Your email has been confirmed. You can now log in.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="text-red-500 w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Verification Failed
            </h1>
            <p className="text-gray-600">
              Invalid or expired confirmation link.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
