const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'client-next/src/Client/pages/Checkout.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update Desktop Place Order button
content = content.replace(
    `{/* Desktop Place Order Button */}
              <button
                type="submit"
                disabled={placingOrder}
                className="hidden lg:flex w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md items-center justify-center gap-3"
              >
                {placingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>`,
    `{/* Desktop Place Order Button */}
              <button
                type="button"
                disabled={true}
                className="hidden lg:flex w-full bg-gray-400 text-white font-bold h-14 rounded-full tracking-widest uppercase text-sm transition-all shadow-md items-center justify-center gap-3 cursor-not-allowed"
              >
                <LockClosedIcon className="w-5 h-5" />
                Coming Soon
              </button>`
);

// Update Mobile Place Order button
content = content.replace(
    `<button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-resin-dark hover:bg-resin-blue disabled:bg-gray-400 text-white font-bold h-12 rounded-xl tracking-widest uppercase text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {placingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="w-5 h-5" />
                    Place Order
                  </>
                )}
              </button>`,
    `<button
                type="button"
                disabled={true}
                className="w-full bg-gray-400 text-white font-bold h-12 rounded-xl tracking-widest uppercase text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <LockClosedIcon className="w-5 h-5" />
                Coming Soon
              </button>`
);

// Add (Coming Soon) to Payment Method header
content = content.replace(
    `<h2 className="text-xl font-bold font-serif text-resin-dark mb-6 border-b border-gray-100 pb-4">
                Payment Method
              </h2>`,
    `<h2 className="text-xl font-bold font-serif text-resin-dark mb-6 border-b border-gray-100 pb-4">
                Payment Method <span className="text-sm text-gray-500 font-normal">(Coming Soon)</span>
              </h2>`
);

// Disable Razorpay radio
content = content.replace(
    `<input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-resin-blue"
                  />`,
    `<input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={false}
                    disabled={true}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-gray-400 cursor-not-allowed"
                  />`
);

// Disable COD radio
content = content.replace(
    `<input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={paymentMethod === "cash_on_delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-resin-blue"
                  />`,
    `<input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={false}
                    disabled={true}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-gray-400 cursor-not-allowed"
                  />`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Patched Checkout.jsx successfully.');
