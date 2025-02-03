"use client";
import { useState } from "react";

const ShefNearMeSwitchToggle = ({ setZipcode, setIsOn }) => {
  const [isOn, setIsOnInput] = useState(false);
  const [zipcode, setZipcodeInput] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleToggle = () => {
    if (!isOn) {
      setShowPopup(true);
    }
    setIsOnInput(!isOn);
    setIsOn(!isOn);
    if (isOn) {
      setZipcode("");
    }
  };

  const handleZipcodeSubmit = (event) => {
    event.preventDefault();
    if (zipcode.length >= 5) {
      setZipcode(zipcode);
      setShowPopup(false);
    } else {
      alert("Zipcode must be at least 5 characters long");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between bg-gray-200 p-2 rounded-full scale-75">
        <span className="font-bold text-xs px-2">Shef Near Me</span>
        <button
          onClick={handleToggle}
          className={`relative w-16 h-9 flex items-center p-1 rounded-full transition-all shadow-md ${
            isOn ? "bg-emerald-500" : "bg-rose-500"
          }`}
        >
          <span
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all bg-white ${
              isOn ? "translate-x-7" : "translate-x-0"
            }`}
          >
            {isOn ? (
              <div className="w-4 h-4 border-2 border-black rounded-full"></div>
            ) : (
              <div className="w-4 h-0.5 bg-black"></div>
            )}
          </span>
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Enter Your Zipcode
            </h2>
            <form onSubmit={handleZipcodeSubmit}>
              <label htmlFor="zipcode" className="block text-sm text-gray-600">
                Zipcode
              </label>
              <input
                id="zipcode"
                type="number"
                value={zipcode}
                onChange={(e) => setZipcodeInput(e.target.value)}
                className="w-full border border-gray-300 p-2 mt-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter zipcode"
                min={10000}
                minLength="5"
              />
              <div className="mt-4 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    setZipcodeInput("");
                    setIsOnInput(false);
                  }}
                  className="px-6 py-2 text-sm font-bold text-white bg-rose-500 rounded-full border-none outline-none hover:bg-rose-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-sm font-bold text-white bg-emerald-500 rounded-full border-none outline-none hover:bg-emerald-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShefNearMeSwitchToggle;
