import React, { useState } from "react";
// import CheckoutForm from "./CheckoutForms/IntelectaPro_Form/form"; // Ensure correct path

function PricingPage() {
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen h-screen mx-auto py-8 bg-gunmetal">
      <h1 className="text-3xl font-bold text-center mb-10">Become a Pro</h1>
      <div className="flex flex-col items-center">
        <div className="text-center text-lg max-w-xl text-airforce-blue p-5 bg-transparent rounded-lg shadow-xl shadow-blue-mainpagebeforeLogin">
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">Intelecta Pro</div>
            <ul className="text-blue-mainbeforeLogin text-base text-left list-disc list-inside">
              <li>Learn faster with AI</li>
              <li>Personalized learning paths</li>
              <li>Interactive and engaging lessons</li>
            </ul>
            <p className="text-gray-700 text-base mt-4">
              <span className="font-bold">Price:</span> $10/month
            </p>
            <button
              className="btn btn-outline btn-info flex justify-center w-full font-bold text-xl mt-6"
              onClick={() => setCheckoutOpen(true)}
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Pop-up Modal */}
        {isCheckoutOpen &&
          {
            /* <CheckoutForm onClose={() => setCheckoutOpen(false)} /> */
          }}
      </div>
    </div>
  );
}

export default PricingPage;
