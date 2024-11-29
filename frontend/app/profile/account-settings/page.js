"use client"
import { useState, useEffect } from 'react';

export default function AccountSettings() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = cookie.get('token');

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:1337/users/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setFormData({
          username: data.username,
          email: data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    const updateData = {
      username: formData.username,
      email: formData.email,
      password: formData.newPassword,
    };

    // API call to update user data
    try {
      const response = await fetch('http://localhost:1337/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const data = await response.json();
      console.log('User data updated successfully:', data);
      alert('Your account has been updated!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-orange-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-orange-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Password Change Section */}
        <div>
          <h3 className="text-lg font-medium text-orange-900">Change Password</h3>

          <div className="mt-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-orange-700">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-orange-700">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-orange-700">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-orange-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}