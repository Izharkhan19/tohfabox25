import React, { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../api-services/apiService';
import { toast } from 'react-toastify';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import LogoLoader from '../../components/LogoLoader';

export default function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ id: null, message: '', link: '', isActive: false });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        const result = await getAnnouncements();
        if (result?.success) {
            setAnnouncements(result.data?.data || []);
        }
        setLoading(false);
    };

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
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Offer Banners</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage announcement banners shown on the client side.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" /> Add New
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Message</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Link</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {announcements.map((item) => (
                            <tr key={item._id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.message}</td>
                                <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-[200px]">{item.link || '-'}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-900 mr-3">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl relative">
                        <h3 className="text-xl font-bold mb-4">{formData.id ? 'Edit Announcement' : 'Add Announcement'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Message Text</label>
                                <input
                                    type="text"
                                    required
                                    maxLength={200}
                                    placeholder="e.g. Use code SAVE10 for 10% off"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. /products?category=sale"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Set as Active (Will replace any currently active banner)
                                </label>
                            </div>
                            
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
