"use client";
import React, { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../api-services/apiService';
import { toast } from 'react-toastify';
import { TrashIcon, PencilIcon, PlusIcon, MegaphoneIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import LogoLoader from '../../components/LogoLoader';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, message: '', link: '', isActive: false });

    const fetchAnnouncements = async () => {
        setLoading(true);
        const result = await getAnnouncements();
        if (result?.success) {
            setAnnouncements(result.data?.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleOpenModal = (announcement = null) => {
        if (announcement) {
            setFormData({
                id: announcement._id,
                message: announcement.message,
                link: announcement.link || '',
                isActive: announcement.isActive
            });
        } else {
            setFormData({ id: null, message: '', link: '', isActive: false });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                const res = await updateAnnouncement(formData.id, formData);
                if (res?.success) {
                    toast.success('Announcement updated');
                }
            } else {
                const res = await createAnnouncement(formData);
                if (res?.success) {
                    toast.success('Announcement created');
                }
            }
            setShowModal(false);
            fetchAnnouncements();
        } catch (error) {
            toast.error('Failed to save announcement');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            const res = await deleteAnnouncement(id);
            if (res?.success) {
                toast.success('Announcement deleted');
                fetchAnnouncements();
            }
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><LogoLoader /></div>;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Offer Banners</h1>
                    <p className="text-gray-500 text-xs sm:text-sm mt-0.5">Manage announcement banners shown on the client side.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-blue-700 active:scale-95 transition flex items-center justify-center gap-2 shadow-sm text-sm"
                >
                    <PlusIcon className="w-5 h-5" /> Add New
                </button>
            </div>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Link</th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {announcements.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50/50 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-md break-words">{item.message}</td>
                                    <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-[200px]">
                                        {item.link ? (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                                                <span>{item.link}</span>
                                                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 inline flex-shrink-0" />
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleOpenModal(item)} 
                                                className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item._id)} 
                                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {announcements.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No announcements found. Add one to display it on the client side.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View (Hidden on desktop) */}
            <div className="md:hidden flex flex-col gap-3">
                {announcements.map((item) => (
                    <div 
                        key={item._id} 
                        className={`bg-white rounded-xl sm:rounded-2xl border p-4 shadow-sm transition ${
                            item.isActive ? 'border-green-200 ring-1 ring-green-100' : 'border-gray-200'
                        }`}
                    >
                        {/* Card Top: Status & Action Buttons */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                {item.isActive ? 'Active Banner' : 'Inactive'}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg active:scale-95 transition"
                                    aria-label="Edit"
                                >
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg active:scale-95 transition"
                                    aria-label="Delete"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Card Body: Message */}
                        <div className="mt-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Message</p>
                            <p className="text-sm font-medium text-gray-900 leading-relaxed break-words bg-gray-50/70 p-3 rounded-lg border border-gray-100">
                                {item.message}
                            </p>
                        </div>

                        {/* Card Footer: Target Link */}
                        {item.link && (
                            <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                                <span className="text-gray-500">Destination link:</span>
                                <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-blue-600 font-semibold hover:underline flex items-center gap-1 truncate max-w-[200px]"
                                >
                                    <span className="truncate">{item.link}</span>
                                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                </a>
                            </div>
                        )}
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
                        <MegaphoneIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <h3 className="text-base font-bold text-gray-700">No offer banners</h3>
                        <p className="text-xs text-gray-500 mt-1">Tap &quot;+ Add New&quot; above to publish your first banner.</p>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-5 sm:p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900">{formData.id ? 'Edit Announcement' : 'Add Announcement'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Message Text</label>
                                <textarea
                                    required
                                    rows={3}
                                    maxLength={200}
                                    placeholder="e.g. 🎉 Flat 10% OFF on shopping of ₹1000 and above!"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                />
                                <span className="text-[11px] text-gray-400 text-right block mt-0.5">{formData.message.length}/200</span>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Target Link (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. /products or /products?category=sale"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-start gap-2.5 mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="isActive" className="text-xs sm:text-sm text-gray-700 cursor-pointer leading-tight">
                                    <strong className="block font-semibold text-gray-900">Set as Active Banner</strong>
                                    Will immediately show at the top of the client website.
                                </label>
                            </div>
                            
                            <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-95 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-95 transition shadow-sm"
                                >
                                    Save Banner
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
