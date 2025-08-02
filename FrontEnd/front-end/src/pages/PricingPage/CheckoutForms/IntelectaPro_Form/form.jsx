// import React, { useState, useEffect } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import {
//   EmbeddedCheckoutProvider,
//   EmbeddedCheckout,
// } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe(
//   "pk_live_51PB2X1Lu58ORmrX9xxhkCVhJH1HhdR5XuZ7GO7TvRfbi8dDo5EVBl8JwMaPnaLmvLjp0wwJCfowUJVYioXSeFbSK00VBseQEND"
// );

// const CheckoutForm = () => {
//   const [clientSecret, setClientSecret] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     async function fetchClientSecret() {
//       try {
//         const response = await fetch("/check", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         });
//         if (!response.ok) {
//           throw new Error(
//             "Network response was not ok: " + response.statusText
//           );
//         }
//         const data = await response.json();
//         setClientSecret(data.clientSecret);
//       } catch (error) {
//         console.error("An error occurred");
//         setError("Failed to fetch client secret: " + error.message);
//       }
//     }

//     fetchClientSecret();
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
//       <div
//         className="bg-white rounded-lg shadow-xl overflow-auto p-8 max-h-full w-full max-w-md m-auto"
//         style={{ paddingTop: "5rem", paddingBottom: "5rem", overflowY: "auto" }}
//       >
//         {clientSecret ? (
//           <EmbeddedCheckoutProvider
//             stripe={stripePromise}
//             options={{ clientSecret }}
//           >
//             <EmbeddedCheckout />
//           </EmbeddedCheckoutProvider>
//         ) : error ? (
//           <div className="text-center">
//             <p className="text-red-500 text-lg">{error}</p>
//           </div>
//         ) : (
//           <div className="text-center">
//             <p className="text-lg text-gray-600">Preparing your checkout...</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CheckoutForm;
