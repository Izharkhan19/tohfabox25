// // src/Client/components/WishlistLoginModal.jsx
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { Link } from "react-router-dom";
// import { HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";

// export default function WishlistLoginModal({ isOpen, onClose }) {
//     return (
//         <Transition appear show={isOpen} as={Fragment}>
//             <Dialog as="div" className="relative z-50" onClose={onClose}>
//                 <Transition.Child
//                     as={Fragment}
//                     enter="ease-out duration-300"
//                     enterFrom="opacity-0"
//                     enterTo="opacity-100"
//                     leave="ease-in duration-200"
//                     leaveFrom="opacity-100"
//                     leaveTo="opacity-0"
//                 >
//                     <div className="fixed inset-0 bg-black bg-opacity-50" />
//                 </Transition.Child>

//                 <div className="fixed inset-0 overflow-y-auto">
//                     <div className="flex min-h-full items-center justify-center p-4 text-center">
//                         <Transition.Child
//                             as={Fragment}
//                             enter="ease-out duration-300"
//                             enterFrom="opacity-0 scale-95"
//                             enterTo="opacity-100 scale-100"
//                             leave="ease-in duration-200"
//                             leaveFrom="opacity-100 scale-100"
//                             leaveTo="opacity-0 scale-95"
//                         >
//                             <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-8 text-left align-middle shadow-xl transition-all">
//                                 <div className="flex justify-between items-center mb-6">
//                                     <div className="flex items-center gap-3">
//                                         <div className="bg-red-100 rounded-full p-3">
//                                             <HeartIcon className="w-8 h-8 text-red-600" />
//                                         </div>
//                                         <Dialog.Title className="text-2xl font-bold text-gray-900">
//                                             Save to Wishlist
//                                         </Dialog.Title>
//                                     </div>
//                                     <button onClick={onClose}>
//                                         <XMarkIcon className="w-6 h-6 text-gray-400" />
//                                     </button>
//                                 </div>

//                                 <p className="text-gray-600 mb-8">
//                                     Sign in to save items to your wishlist and access them from any device.
//                                 </p>

//                                 <div className="space-y-4">
//                                     <Link
//                                         to="/login"
//                                         state={{ from: window.location.pathname }}
//                                         onClick={onClose}
//                                         className="block text-center bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl transition"
//                                     >
//                                         Sign In
//                                     </Link>
//                                     <Link
//                                         to="/register"
//                                         state={{ from: window.location.pathname }}
//                                         onClick={onClose}
//                                         className="block text-center border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-bold py-4 rounded-xl transition"
//                                     >
//                                         Create Account
//                                     </Link>
//                                 </div>
//                             </Dialog.Panel>
//                         </Transition.Child>
//                     </div>
//                 </div>
//             </Dialog>
//         </Transition>
//     );
// }

// src/Client/components/WishlistLoginModal.jsx
import { Link } from "react-router-dom";
// import { XMarkIcon, HeartIcon as HeartSolidIcon } from "@heroicons/react/24/outline";
import { FunnelIcon, MagnifyingGlassIcon, HeartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";


export default function WishlistLoginModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                        <HeartSolidIcon className="w-6 h-6 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Save to Wishlist
                    </h3>
                    <p className="text-gray-600 mb-8">
                        Sign in to save this item and access your wishlist from any device.
                    </p>

                    <div className="space-y-4">
                        <Link
                            to="/login"
                            state={{ from: window.location.pathname }}
                            onClick={onClose}
                            className="block w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl text-center transition"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            state={{ from: window.location.pathname }}
                            onClick={onClose}
                            className="block w-full border-2 border-gray-300 hover:border-gray-400 text-gray-800 font-bold py-4 rounded-xl text-center transition"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}