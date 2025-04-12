export default function AccountSettings() {
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10">
      {/* Profile Section */}
      <section className="border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">My Profile</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full p-3 border outline-rose-400 rounded-lg"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full p-3 border outline-rose-400 rounded-lg"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full p-3 border outline-rose-400 rounded-lg"
          />
          <button className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all">
            Save
          </button>
        </div>
      </section>

      {/* Change Password Section */}
      <section className="border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full p-3 border outline-rose-400 rounded-lg"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border outline-rose-400 rounded-lg"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-3 border outline-rose-400 rounded-lg"
          />
          <button className="w-full bg-rose-600 text-white py-3 rounded-full shadow-rose-300 shadow-md hover:bg-rose-700 transition-all">
            Save
          </button>
        </div>
      </section>
    </div>
  );
}
