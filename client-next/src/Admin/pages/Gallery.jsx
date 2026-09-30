"use client";
import { useEffect, useRef, useState } from 'react';
import { PhotoIcon, TrashIcon, PencilSquareIcon, PlusIcon, XMarkIcon, CheckIcon, InboxIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LogoLoader from '../../components/LogoLoader';
import {
    getGalleryItems,
    createGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,
    getGalleryOrders,
    updateGalleryOrderStatus,
    deleteGalleryOrder,
} from '../../api-services/apiService';

const emptyForm = { title: '', description: '', price: '', isActive: true, image: null };

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const statusColors = {
    Pending:    'bg-yellow-100 text-yellow-700',
    Confirmed:  'bg-blue-100 text-blue-700',
    Processing: 'bg-purple-100 text-purple-700',
    Shipped:    'bg-indigo-100 text-indigo-700',
    Delivered:  'bg-green-100 text-green-700',
    Cancelled:  'bg-red-100 text-red-600',
};

export default function AdminGallery() {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [preview, setPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editId, setEditId] = useState(null);
    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'orders'
    const fileRef = useRef();

    const loadGallery = async () => {
        setLoading(true);
        const res = await getGalleryItems({ isActive: undefined });
        if (res?.success) setItems(res.data?.data || []);
        else toast.error(res?.message || 'Failed to load gallery');
        setLoading(false);
    };

    const loadOrders = async () => {
        setOrdersLoading(true);
        const res = await getGalleryOrders();
        if (res?.success) setOrders(res.data?.data || []);
        else toast.error(res?.message || 'Failed to load orders');
        setOrdersLoading(false);
    };

    useEffect(() => { loadGallery(); loadOrders(); }, []);

    const openCreate = () => {
        setForm(emptyForm);
        setPreview(null);
        setEditId(null);
        setShowForm(true);
    };

    const openEdit = (item) => {
        setForm({ title: item.title, description: item.description || '', price: item.price || '', isActive: item.isActive, image: null });
        setPreview(item.image?.url || null);
        setEditId(item._id);
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setForm(emptyForm); setPreview(null); setEditId(null); };

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setForm(prev => ({ ...prev, image: file }));
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editId && !form.image) { toast.error('Please select an image'); return; }
        setSaving(true);
        const fd = new FormData();
        fd.append('title', form.title.trim());
        fd.append('description', form.description.trim());
        fd.append('price', form.price || 0);
        fd.append('isActive', form.isActive);
        if (form.image) fd.append('image', form.image);

        const res = editId
            ? await updateGalleryItem(editId, fd)
            : await createGalleryItem(fd);

        if (res?.success) {
            toast.success(editId ? 'Gallery item updated!' : 'Gallery item added!');
            closeForm();
            loadGallery();
        } else toast.error(res?.message || 'Failed to save');
        setSaving(false);
    };

    const handleDeleteItem = async (id) => {
        const item = items.find(i => i._id === id);
        const confirm = await Swal.fire({
            title: 'Delete gallery item?',
            text: `"${item?.title}" will be removed permanently.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!confirm.isConfirmed) return;
        const res = await deleteGalleryItem(id);
        if (res?.success) { setItems(prev => prev.filter(i => i._id !== id)); toast.success('Deleted!'); }
        else toast.error(res?.message || 'Failed to delete');
    };

    const handleOrderStatusChange = async (id, status) => {
        const res = await updateGalleryOrderStatus(id, status);
        if (res?.success) {
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
            toast.success('Status updated!');
        } else toast.error(res?.message || 'Failed to update status');
    };

    const handleDeleteOrder = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete this order?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });
        if (!confirm.isConfirmed) return;
        const res = await deleteGalleryOrder(id);
        if (res?.success) { setOrders(prev => prev.filter(o => o._id !== id)); toast.success('Order deleted!'); }
        else toast.error(res?.message || 'Failed to delete');
    };

    const inputClass = 'mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-100';
    const pendingCount = orders.filter(o => o.status === 'Pending').length;

    return (
        <div className="w-full space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-purple-600">Visual Showcase</p>
                    <h1 className="mt-1 text-3xl font-bold text-gray-800">Gallery Manager</h1>
                    <p className="mt-2 max-w-xl text-sm text-gray-500">
                        Manage your gallery images and view quick orders placed by users.
                    </p>
                </div>
                {activeTab === 'gallery' && (
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-purple-700 whitespace-nowrap"
                    >
                        <PlusIcon className="w-5 h-5" /> Add Gallery Item
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-xl bg-gray-100 p-1 w-fit">
                <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'gallery' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <span className="flex items-center gap-2"><PhotoIcon className="w-4 h-4" /> Gallery Items ({items.length})</span>
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-white shadow text-purple-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <span className="flex items-center gap-2">
                        <InboxIcon className="w-4 h-4" /> Orders ({orders.length})
                        {pendingCount > 0 && (
                            <span className="bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">{pendingCount}</span>
                        )}
                    </span>
                </button>
            </div>

            {/* ─── GALLERY TAB ─── */}
            {activeTab === 'gallery' && (
                <>
                    {/* Add / Edit Form */}
                    {showForm && (
                        <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-md">
                            <div className="border-b border-gray-100 bg-purple-50/60 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center">
                                <div>
                                    <h2 className="font-bold text-gray-800">{editId ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h2>
                                    <p className="mt-0.5 text-xs text-gray-500">Fill in details and upload an image.</p>
                                </div>
                                <button onClick={closeForm} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="grid gap-5 p-4 sm:grid-cols-2 sm:px-3 py-4 sm:p-6">
                                {/* Image Upload */}
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className="sm:col-span-2 cursor-pointer rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 hover:bg-purple-50 transition flex flex-col items-center justify-center gap-2 min-h-[160px] overflow-hidden relative"
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full max-h-56 object-contain" />
                                    ) : (
                                        <>
                                            <PhotoIcon className="w-10 h-10 text-purple-300" />
                                            <p className="text-sm text-gray-500 font-medium">Click to upload an image</p>
                                            <p className="text-xs text-gray-400">JPG, PNG, WEBP up to 5MB</p>
                                        </>
                                    )}
                                    {preview && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition text-white font-bold text-sm">
                                            Change Image
                                        </div>
                                    )}
                                </div>
                                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

                                <label className="text-xs font-bold text-gray-600">
                                    Title *
                                    <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className={inputClass} placeholder="e.g. Handcrafted Gift Hamper" />
                                </label>

                                <label className="text-xs font-bold text-gray-600">
                                    Price (₹) <span className="font-normal text-gray-400">(optional)</span>
                                    <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className={inputClass} placeholder="0" />
                                </label>

                                <label className="sm:col-span-2 text-xs font-bold text-gray-600">
                                    Description <span className="font-normal text-gray-400">(optional)</span>
                                    <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className={`${inputClass} resize-none`} placeholder="Brief description shown in the quick order panel..." />
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-gray-700">
                                    <div onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-purple-600' : 'bg-gray-300'}`}>
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                    {form.isActive ? 'Visible to users' : 'Hidden from users'}
                                </label>

                                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                                    <button type="button" onClick={closeForm} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                                    <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:bg-gray-400">
                                        {saving ? 'Saving...' : (<><CheckIcon className="w-4 h-4" />{editId ? 'Update Item' : 'Add to Gallery'}</>)}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Gallery Grid */}
                    {loading ? (
                        <div className="py-16"><LogoLoader label="Loading gallery..." compact /></div>
                    ) : items.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
                            <h2 className="mt-3 font-bold text-gray-700">No gallery items yet</h2>
                            <p className="mt-1 text-sm text-gray-500">Click "Add Gallery Item" above to get started.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map(item => (
                                <div key={item._id} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                        <img src={item.image?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <span className={`absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                            {item.isActive ? 'Live' : 'Hidden'}
                                        </span>
                                        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(item)} className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-blue-600 hover:bg-blue-50 transition"><PencilSquareIcon className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteItem(item._id)} className="w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-red-500 hover:bg-red-50 transition"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <p className="font-bold text-gray-800 text-sm truncate">{item.title}</p>
                                        {item.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>}
                                        <p className="mt-1 text-base font-extrabold text-purple-600">
                                            {item.price > 0 ? `₹${Number(item.price).toLocaleString('en-IN')}` : 'Price on inquiry'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* ─── ORDERS TAB ─── */}
            {activeTab === 'orders' && (
                <>
                    {ordersLoading ? (
                        <div className="py-16"><LogoLoader label="Loading orders..." compact /></div>
                    ) : orders.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                            <InboxIcon className="mx-auto h-12 w-12 text-gray-300" />
                            <h2 className="mt-3 font-bold text-gray-700">No gallery orders yet</h2>
                            <p className="mt-1 text-sm text-gray-500">Orders placed from the gallery will appear here.</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="text-left px-4 py-3.5 font-bold text-gray-600 text-xs uppercase tracking-wider">Item</th>
                                            <th className="text-left px-4 py-3.5 font-bold text-gray-600 text-xs uppercase tracking-wider">Customer</th>
                                            <th className="text-left px-4 py-3.5 font-bold text-gray-600 text-xs uppercase tracking-wider hidden md:table-cell">Phone</th>
                                            <th className="text-left px-4 py-3.5 font-bold text-gray-600 text-xs uppercase tracking-wider hidden lg:table-cell">Qty / Total</th>
                                            <th className="text-left px-4 py-3.5 font-bold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                                            <th className="text-left px-4 py-3.5 font-bold text-gray-600 text-xs uppercase tracking-wider">Date</th>
                                            <th className="px-4 py-3.5"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.map(order => (
                                            <tr key={order._id} className="hover:bg-gray-50/60 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {order.productImage && (
                                                            <img src={order.productImage} alt={order.productTitle} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                                                        )}
                                                        <span className="font-semibold text-gray-800 text-xs line-clamp-2 max-w-[120px]">{order.productTitle}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-bold text-gray-800">{order.name}</p>
                                                    {order.address && <p className="text-xs text-gray-500 line-clamp-1">{order.address}</p>}
                                                </td>
                                                <td className="px-4 py-3 hidden md:table-cell text-gray-600 font-mono text-xs">{order.phone}</td>
                                                <td className="px-4 py-3 hidden lg:table-cell">
                                                    <span className="font-bold text-gray-800">×{order.quantity}</span>
                                                    {order.totalPrice > 0 && <span className="ml-2 text-purple-600 font-bold">₹{Number(order.totalPrice).toLocaleString('en-IN')}</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                                                        className={`text-xs font-black rounded-full px-3 py-1.5 border-0 cursor-pointer outline-none ${statusColors[order.status]}`}
                                                    >
                                                        {ORDER_STATUSES.map(s => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button onClick={() => handleDeleteOrder(order._id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
