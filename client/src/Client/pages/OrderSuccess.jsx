import { Link } from "react-router-dom";
import { CheckBadgeIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function OrderSuccess() {
    useEffect(() => {
        // Trigger a nice confetti explosion when they land on the success page
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-xl w-full bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100">
                    <CheckBadgeIcon className="w-12 h-12 text-green-500" />
                </div>
                
                <h1 className="text-4xl font-serif font-bold text-resin-dark mb-4">
                    Order Confirmed
                </h1>
                
                <p className="text-gray-500 mb-8 text-lg leading-relaxed">
                    Thank you for your purchase. Your handcrafted resin masterpiece will soon be on its way to you. We've sent a confirmation email with your order details.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/orders"
                        className="inline-flex items-center justify-center gap-2 bg-resin-dark hover:bg-resin-blue text-white font-bold h-14 px-8 rounded-full tracking-widest uppercase text-sm transition-all shadow-md"
                    >
                        <ShoppingBagIcon className="w-5 h-5" />
                        View My Orders
                    </Link>
                    
                    <Link
                        to="/products"
                        className="inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-resin-dark border border-gray-200 font-bold h-14 px-8 rounded-full tracking-widest uppercase text-sm transition-all"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}