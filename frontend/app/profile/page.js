// pages/profile.js
import React from 'react'

const ProfilePage = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold">Your Profile</h1>
        <p className="text-gray-500">Manage your account, orders, and settings</p>
      </div>

      <div className="space-y-8">
        {/* Account Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-gray-700">Update your personal information and settings.</p>
          <button className="mt-4 text-blue-500 hover:text-blue-700">Edit Account Settings</button>
        </div>

        {/* Order History */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <p className="text-gray-700">View your past orders and transaction details.</p>
          <button className="mt-4 text-blue-500 hover:text-blue-700">View Orders</button>
        </div>

        {/* Security & Privacy Settings */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Security & Privacy</h2>
          <p className="text-gray-700">Change your password, enable 2FA, or review privacy settings.</p>
          <button className="mt-4 text-blue-500 hover:text-blue-700">Manage Security</button>
        </div>

        {/* Become a Vendor */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Become a Vendor</h2>
          <p className="text-gray-700">Want to start selling? Apply to become a vendor.</p>
          <button className="mt-4 text-blue-500 hover:text-blue-700">Apply Now</button>
        </div>

        {/* Logout / Account Deletion */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-red-500">Account Deletion</h2>
          <p className="text-gray-700">If you wish to delete your account, click the button below. This action is irreversible.</p>
          <button className="mt-4 text-red-500 hover:text-red-700">Delete Account</button>
        </div>

        {/* Logout Button */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <button className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
