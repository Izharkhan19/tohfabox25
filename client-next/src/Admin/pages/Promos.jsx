"use client";
import { useEffect, useState } from 'react';
import { TrashIcon, TagIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createPromo, deletePromo, getPromos } from '../../api-services/apiService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import LogoLoader from '../../components/LogoLoader';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';

const initialForm = {
    code: '', discountType: 'percentage', discountValue: 10, minimumOrderValue: 0,
    startsAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 86400000),
    usageLimit: ''
};

const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage (%)' },
    { value: 'fixed', label: 'Fixed amount (₹)' }
];

export default function Promos() {
    const [promos, setPromos] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadPromos = async () => {
        setLoading(true);
        const result = await getPromos();
        if (result?.success) setPromos(result.data?.data || []);
        else toast.error(result?.message || 'Failed to load promo codes');
        setLoading(false);
    };

    useEffect(() => {
        const timer = setTimeout(loadPromos, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleOpenModal = () => {
        setForm(initialForm);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setForm(initialForm);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        const result = await createPromo({
            ...form,
            code: form.code.trim().toUpperCase(),
            discountValue: Number(form.discountValue),
            minimumOrderValue: Number(form.minimumOrderValue),
            usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined
        });
        if (result?.success) {
            toast.success('Promo code created successfully');
            handleCloseModal();
            loadPromos();
        } else {
            toast.error(result?.message || 'Failed to create promo code');
        }
        setSaving(false);
    };

    const handleDelete = async (id) => {
        const confirmation = await Swal.fire({
            title: 'Delete promo code?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Yes, delete it!'
        });

        if (!confirmation.isConfirmed) return;

        const result = await deletePromo(id);
        if (result?.success) {
            setPromos((current) => current.filter((item) => item._id !== id));
            toast.success('Promo code deleted');
        } else toast.error(result?.message || 'Failed to delete promo code');
    };

    const inputClass = 'mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100';

    return (
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-[#e1b382]/20">
                <div>
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#12343b]">Promo Codes</h1>
                    <p className="mt-0.5 text-xs sm:text-sm text-stone-500">Create discount coupons and checkout offers.</p>
                </div>
                <button
                    onClick={handleOpenModal}
                    className="inline-flex items-center justify-center gap-1.5 bg-[#12343b] hover:bg-[#0e272d] text-[#e1b382] border border-[#e1b382]/30 font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-sm active:scale-95 transition text-xs sm:text-sm self-start sm:self-auto"
                >
                    <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#e1b382]" />
                    <span>Create Promo Code</span>
                </button>
            </div>

            {/* List of Promos */}
            {loading ? (
                <div className="py-12"><LogoLoader label="Loading promo codes..." compact /></div>
            ) : promos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                    <TagIcon className="mx-auto h-12 w-12 text-gray-300" />
                    <h2 className="mt-3 font-bold text-gray-800 text-base sm:text-lg">No promo codes yet</h2>
                    <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">Click &quot;Create Promo Code&quot; to add your first discount campaign.</p>
                    <button
                        onClick={handleOpenModal}
                        className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                    >
                        <PlusIcon className="w-4 h-4" /> Create Promo
                    </button>
                </div>
            ) : (
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {promos.map((promo) => {
                        const active = promo.isActive && new Date() >= new Date(promo.startsAt) && new Date() <= new Date(promo.expiresAt) && (!promo.usageLimit || promo.usedCount < promo.usageLimit);
                        return (
                            <div key={promo._id} className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                            <TagIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </div>
                                        <strong className="text-base sm:text-lg text-gray-900 tracking-wide font-mono">{promo.code}</strong>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => handleDelete(promo._id)} 
                                        aria-label={`Delete ${promo.code}`} 
                                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                                    >
                                        <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </button>
                                </div>
                                <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${active ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-500'}`}>
                                    {active ? 'Active now' : 'Inactive'}
                                </span>
                                <p className="mt-2.5 text-lg sm:text-2xl font-serif font-bold text-[#12343b]">
                                    {promo.discountType === 'percentage' ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`}
                                </p>
                                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-xs sm:text-sm text-gray-500">
                                    <p><span className="text-gray-400">Min. order:</span> ₹{promo.minimumOrderValue.toFixed(2)}</p>
                                    <p><span className="text-gray-400">Validity:</span> {new Date(promo.startsAt).toLocaleDateString()} – {new Date(promo.expiresAt).toLocaleDateString()}</p>
                                    <p className="font-medium text-gray-700"><span className="text-gray-400">Usage:</span> {promo.usedCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ' times'}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Promo Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) handleCloseModal();
                    }}
                    role="presentation"
                >
                    <div
                        className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[#e1b382]/30 bg-white shadow-2xl animate-in slide-in-from-bottom duration-200"
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Header */}
                        <div className="shrink-0 flex items-center justify-between border-b border-stone-100 bg-[#fcfaf7] px-4 py-3 sm:px-6 sm:py-4">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#c89666]">Marketing &amp; Discounts</p>
                                <h3 className="text-base sm:text-xl font-serif font-bold text-[#12343b]">Create Promo Code</h3>
                            </div>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                aria-label="Close dialog"
                                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-95 transition"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                            <form id="promo-create-form" onSubmit={handleSubmit} className="space-y-4 pt-1">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="text-xs font-bold text-gray-700">Promo Code *</label>
                                        <input 
                                            required 
                                            placeholder="e.g. FESTIVE20" 
                                            value={form.code} 
                                            onChange={(e) => setForm({ ...form, code: e.target.value })} 
                                            className={`${inputClass} uppercase font-mono font-semibold`} 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700">Discount Type *</label>
                                        <Select 
                                            value={discountTypeOptions.find((option) => option.value === form.discountType)} 
                                            onChange={(option) => setForm({ ...form, discountType: option.value })} 
                                            options={discountTypeOptions} 
                                            isSearchable={false} 
                                            className="mt-1 text-sm" 
                                            styles={{ 
                                                control: (base, state) => ({ 
                                                    ...base, 
                                                    minHeight: 42, 
                                                    borderRadius: 12, 
                                                    borderColor: state.isFocused ? '#12343b' : '#e5e7eb', 
                                                    backgroundColor: state.isFocused ? '#fff' : '#f9fafb', 
                                                    boxShadow: state.isFocused ? '0 0 0 2px rgba(18,52,59,0.1)' : 'none' 
                                                })
                                            }} 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700">Discount Value *</label>
                                        <input 
                                            required 
                                            type="number" 
                                            min="0" 
                                            step="0.01" 
                                            placeholder="10"
                                            value={form.discountValue} 
                                            onChange={(e) => setForm({ ...form, discountValue: e.target.value })} 
                                            className={inputClass} 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700">Minimum Order Value (₹)</label>
                                        <input 
                                            type="number" 
                                            min="0" 
                                            step="0.01" 
                                            placeholder="0"
                                            value={form.minimumOrderValue} 
                                            onChange={(e) => setForm({ ...form, minimumOrderValue: e.target.value })} 
                                            className={inputClass} 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700">Starts At *</label>
                                        <DatePicker 
                                            selected={form.startsAt} 
                                            onChange={(date) => setForm({ ...form, startsAt: date })} 
                                            showTimeSelect 
                                            dateFormat="dd MMM yyyy, h:mm aa" 
                                            minDate={new Date()} 
                                            className={inputClass} 
                                            wrapperClassName="w-full" 
                                            required 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-gray-700">Expires At *</label>
                                        <DatePicker 
                                            selected={form.expiresAt} 
                                            onChange={(date) => setForm({ ...form, expiresAt: date })} 
                                            showTimeSelect 
                                            dateFormat="dd MMM yyyy, h:mm aa" 
                                            minDate={form.startsAt || new Date()} 
                                            className={inputClass} 
                                            wrapperClassName="w-full" 
                                            required 
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="text-xs font-bold text-gray-700">
                                            Usage Limit <span className="font-normal text-gray-400">(leave blank for unlimited)</span>
                                        </label>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            placeholder="e.g. 100 uses" 
                                            value={form.usageLimit} 
                                            onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} 
                                            className={inputClass} 
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Sticky Footer */}
                        <div className="shrink-0 flex items-center justify-end gap-2 sm:gap-2.5 px-4 py-3 sm:px-6 sm:py-3.5 bg-[#fcfaf7] border-t border-stone-100">
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 rounded-xl border border-stone-200 hover:bg-stone-100 transition active:scale-95 text-center"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="promo-create-form"
                                disabled={saving}
                                className="flex-1 sm:flex-initial min-h-[42px] px-5 py-2 text-xs sm:text-sm font-semibold text-[#e1b382] bg-[#12343b] hover:bg-[#0e272d] border border-[#e1b382]/30 rounded-xl disabled:bg-stone-400 shadow-sm transition active:scale-95 text-center"
                            >
                                {saving ? 'Creating...' : 'Create Promo Code'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
