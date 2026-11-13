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
        (async () => {
            await Promise.resolve();
            fetchAnnouncements();
        })();
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
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-[#e1b382]/20">
                <div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#12343b]">Offer Banners</h1>
                    <p className="text-stone-500 text-xs sm:text-sm mt-0.5">Manage announcement notification banners shown on the client storefront.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-[#12343b] hover:bg-[#0e272d] text-[#e1b382] border border-[#e1b382]/30 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold active:scale-95 transition flex items-center justify-center gap-2 shadow-sm text-xs sm:text-sm self-start sm:self-auto"
                >
                    <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#e1b382]" /> Add New
                </button>
            </div>

            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-stone-200">
                        <thead className="bg-[#fcfaf7]">
                            <tr>
                                <th className="px-5 py-3.5 text-left text-xs font-serif font-bold text-[#12343b] uppercase tracking-wider">Message</th>
                                <th className="px-5 py-3.5 text-left text-xs font-serif font-bold text-[#12343b] uppercase tracking-wider">Link</th>
                                <th className="px-5 py-3.5 text-center text-xs font-serif font-bold text-[#12343b] uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3.5 text-right text-xs font-serif font-bold text-[#12343b] uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 bg-white">
                            {announcements.map((item) => (
                                <tr key={item._id} className="hover:bg-amber-50/20 transition">
                                    <td className="px-5 py-3.5 text-xs sm:text-sm font-medium text-stone-900 max-w-md break-words">{item.message}</td>
                                    <td className="px-5 py-3.5 text-xs sm:text-sm text-[#12343b] truncate max-w-[200px]">
                                        {item.link ? (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1 font-medium text-[#12343b] hover:text-[#c89666]">
                                                <span>{item.link}</span>
                                                <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 inline flex-shrink-0" />
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right text-xs sm:text-sm font-medium">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button 
                                                onClick={() => handleOpenModal(item)} 
                                                className="p-1.5 text-[#12343b] hover:text-[#0e272d] hover:bg-[#e1b382]/20 rounded-lg transition"
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item._id)} 
                                                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <TrashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {announcements.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-stone-500">
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
                        className={`bg-white rounded-2xl border p-3.5 shadow-sm transition ${
                            item.isActive ? 'border-[#e1b382] ring-1 ring-[#e1b382]/30' : 'border-stone-200'
                        }`}
                    >
                        {/* Card Top: Status & Action Buttons */}
                        <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${item.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.isActive ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
                                {item.isActive ? 'Active Banner' : 'Inactive'}
                            </span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleOpenModal(item)}
                                    className="p-1.5 text-[#12343b] hover:bg-[#e1b382]/20 rounded-lg active:scale-95 transition"
                                    aria-label="Edit"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg active:scale-95 transition"
                                    aria-label="Delete"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Card Body: Message */}
                        <div className="mt-2.5">
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Message</p>
                            <p className="text-xs sm:text-sm font-medium text-stone-900 leading-relaxed break-words bg-[#fcfaf7] p-2.5 rounded-xl border border-stone-200/60">
                                {item.message}
                            </p>
                        </div>

                        {/* Card Footer: Target Link */}
                        {item.link && (
                            <div className="mt-2.5 pt-2 flex items-center justify-between text-xs border-t border-stone-100">
                                <span className="text-stone-400 text-[11px]">Destination link:</span>
                                <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-[#12343b] font-semibold hover:text-[#c89666] hover:underline flex items-center gap-1 truncate max-w-[200px]"
                                >
                                    <span className="truncate">{item.link}</span>
                                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                </a>
                            </div>
                        )}
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-6 text-center">
                        <MegaphoneIcon className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                        <h3 className="text-sm font-bold text-stone-700">No offer banners</h3>
                        <p className="text-xs text-stone-500 mt-0.5">Tap &quot;+ Add New&quot; above to publish your first banner.</p>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-4 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-[#e1b382]/30">
                        <h3 className="text-base sm:text-xl font-serif font-bold mb-3 sm:mb-4 text-[#12343b]">{formData.id ? 'Edit Announcement' : 'Add Announcement'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Message Text</label>
                                <textarea
                                    required
                                    rows={3}
                                    maxLength={200}
                                    placeholder="e.g. 🎉 Flat 10% OFF on shopping of ₹1000 and above!"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#12343b] focus:border-[#12343b] resize-none outline-none"
                                />
                                <span className="text-[10px] text-stone-400 text-right block mt-0.5">{formData.message.length}/200</span>
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-stone-700 mb-1">Target Link (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. /products or /products?category=sale"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-3 py-2 text-xs sm:text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#12343b] focus:border-[#12343b] outline-none"
                                />
                            </div>
                            <div className="flex items-start gap-2.5 mt-2 bg-[#fcfaf7] p-2.5 sm:p-3 rounded-xl border border-stone-200">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 mt-0.5 text-[#12343b] rounded border-stone-300 focus:ring-[#12343b]"
                                />
                                <label htmlFor="isActive" className="text-xs sm:text-sm text-stone-700 cursor-pointer leading-tight">
                                    <strong className="block font-semibold text-[#12343b]">Set as Active Banner</strong>
                                    Will immediately show at the top of the client website.
                                </label>
                            </div>
                            
                            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-stone-700 bg-stone-100 rounded-xl hover:bg-stone-200 active:scale-95 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#e1b382] bg-[#12343b] hover:bg-[#0e272d] border border-[#e1b382]/30 rounded-xl active:scale-95 transition shadow-sm"
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
