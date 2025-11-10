"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [selected, setSelected] = useState("/debit");

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
          {/*  */}
          <div className="m-5 flex justify-center items-center">
            <button className="p-2 rounded-md w-full font-bold text-base">
              Select Payment Method
            </button>
          </div>
          {/* Divider */}
          <div
            className="space-y-6 flex flex-col justify-center px-5"
            id="third-form"
          >
            {/* <!-- Payment Option --> */}
            {/* <div className="m-10 flex justify-center items-center">
              <button className="border-2 border-green-500 p-2 rounded-md w-full">
                Select Verification Method
              </button>
            </div> */}
            {/* Divider */}
            <div
              className="space-y-6 flex flex-col justify-center px-5"
              id="third-form"
            >
              {/* <!-- Payment Option --> */}
              <div className="gap-4 grid grid-cols-2">
                {/* <!-- Radio Button 1 --> */}
                <label className="flex items-center space-y-2 cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="image-radio"
                    value="option1"
                    className="peer hidden"
                    defaultChecked
                    onChange={() => setSelected("/debit")}
                  />
                  <div className="w-44 h-14 border-2 border-gray-300 rounded-lg overflow-hidden p-3 transition-all duration-200 peer-checked:border-4 peer-checked:border-[#003466]">
                    <img
                      src="https://i.ytimg.com/vi/i09C02151PI/maxresdefault.jpg"
                      alt="Card "
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>

                {/* <!-- Radio Button 2 --> */}
                <label className="flex items-center space-y-2 cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="image-radio"
                    value="option2"
                    className="peer hidden"
                    onChange={() => setSelected("/banking")}
                  />
                  <div className="w-44 h-14 border-2 border-gray-300 rounded-lg overflow-hidden p-3 transition-all duration-200 peer-checked:border-4 peer-checked:border-[#003466]">
                    <img
                      src="https://hms.cppluscloud.com/assets/images/payment_opt/net_banking.png"
                      alt="Banking "
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>

                {/* <!-- Radio Button 3 --> */}
                <label className="flex items-center space-y-2 cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="image-radio"
                    value="option2"
                    className="peer hidden"
                    onChange={() => setSelected("/upi-pin")}
                  />
                  <div className="w-44 h-14 border-2 border-gray-300 rounded-lg overflow-hidden p-3 transition-all duration-200 peer-checked:border-4 peer-checked:border-[#003466]">
                    <img
                      src="https://www.financialexpress.com/wp-content/uploads/2019/01/amazon_pay660.jpg"
                      alt="Amazon"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>

                {/*  */}
                <label className="flex items-center space-y-2 cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="image-radio"
                    value="option2"
                    className="peer hidden"
                    onChange={() => setSelected("/upi-pin")}
                  />
                  <div className="w-44 h-14 border-2 border-gray-300 rounded-lg overflow-hidden p-3 transition-all duration-200 peer-checked:border-4 peer-checked:border-[#003466]">
                    <img
                      src="https://logos-marques.com/wp-content/uploads/2023/05/Google-Pay-logo-thmb.png"
                      alt="Google Pay"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>

                {/*  */}
                <label className="flex items-center space-y-2 cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="image-radio"
                    value="option2"
                    className="peer hidden"
                    onChange={() => setSelected("/upi-pin")}
                  />
                  <div className="w-44 h-14 border-2 border-gray-300 rounded-lg overflow-hidden p-3 transition-all duration-200 peer-checked:border-4 peer-checked:border-[#003466]">
                    <img
                      src="https://static.ambitionbox.com/assets/v2/images/rs:fit:1280:960:false:false/bG9jYWw6Ly8vbG9nb3Mvb3JpZ2luYWxzL3Bob25lcGUuanBn.png"
                      alt="PhonePe"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>

                {/*  */}
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="image-radio"
                    value="option2"
                    className="peer hidden"
                    onChange={() => setSelected("/upi-pin")}
                  />
                  <div className="w-44 h-14 border-2 border-gray-300 rounded-lg overflow-hidden p-3 transition-all duration-200 peer-checked:border-4 peer-checked:border-[#003466]">
                    <img
                      src="https://logos-world.net/wp-content/uploads/2020/11/Paytm-Logo-2012-present.jpg"
                      alt="Paytm"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>

                {/*  */}
                <label className="flex items-center space-y-2 cursor-pointer space-x-2">
                  <input
                    type="radio"
                    name="image-radio"
                    value="option2"
                    className="peer hidden"
                    onChange={() => setSelected("/upi")}
                  />
                  <div className="w-44 h-14 border-2 border-gray-300 rounded-lg overflow-hidden p-3 transition-all duration-200 peer-checked:border-4 peer-checked:border-green-500">
                    <img
                      src="https://files.commons.gc.cuny.edu/wp-content/blogs.dir/8010/files/2019/05/tc.png"
                      alt="Other"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </label>
              </div>
              {/* Submit Button */}
              <div className="w-auto flex justify-end items-center mt-5">
                <button
                  className="bg-gradient-to-r from-[#003466] to-[#003466] text-white rounded-sm py-2 px-10 focus:outline-none focus:shadow-outline w-auto"
                  onClick={() => router.push(selected)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
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
