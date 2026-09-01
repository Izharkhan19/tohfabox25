import { useEffect, useState } from 'react';
import { TrashIcon, TagIcon } from '@heroicons/react/24/outline';
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
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed amount' }
];

export default function Promos() {
    const [promos, setPromos] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        const result = await createPromo({
            ...form,
            code: form.code.trim().toUpperCase(),
            discountValue: Number(form.discountValue),
            minimumOrderValue: Number(form.minimumOrderValue),
            usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
            startsAt: form.startsAt,
            expiresAt: form.expiresAt
        });
        if (result?.success) {
            toast.success('Promo code created');
            setForm(initialForm);
            loadPromos();
        } else toast.error(result?.message || 'Failed to create promo code');
        setSaving(false);
    };

    const handleDelete = async (id) => {
        const promo = promos.find((item) => item._id === id);
        const confirmation = await Swal.fire({
            title: 'Delete promo code?',
            text: `${promo?.code || 'This promo code'} will no longer be available at checkout.`,
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

    const inputClass = 'mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100';

    return (
        <div className="w-full space-y-8">
            <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">Campaigns</p>
                <h1 className="mt-1 text-3xl font-bold text-gray-800">Promo codes</h1>
                <p className="mt-2 max-w-xl text-sm text-gray-500">Create offers that automatically expire and apply securely at checkout.</p>
            </div>

            <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-6">
                    <h2 className="font-bold text-gray-800">Create a promotion</h2>
                    <p className="mt-1 text-xs text-gray-500">Customers can use the code during its active period.</p>
                </div>
                <div className="grid gap-x-5 gap-y-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
                    <label className="text-xs font-bold text-gray-600">Promo code<input required placeholder="WELCOME10" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={`${inputClass} uppercase`} /></label>
                    <label className="text-xs font-bold text-gray-600">Discount type<Select value={discountTypeOptions.find((option) => option.value === form.discountType)} onChange={(option) => setForm({ ...form, discountType: option.value })} options={discountTypeOptions} isSearchable={false} className="mt-1 text-sm" styles={{ control: (base, state) => ({ ...base, minHeight: 46, borderRadius: 12, borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb', backgroundColor: state.isFocused ? '#fff' : '#f9fafb', boxShadow: state.isFocused ? '0 0 0 2px #dbeafe' : 'none' }), menu: (base) => ({ ...base, zIndex: 20 }), option: (base, state) => ({ ...base, color: '#1f2937', backgroundColor: state.isFocused ? '#eff6ff' : '#fff' }) }} /></label>
                    <label className="text-xs font-bold text-gray-600">Discount value<input required type="number" min="0" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className={inputClass} /></label>
                    <label className="text-xs font-bold text-gray-600">Minimum order value<input type="number" min="0" step="0.01" value={form.minimumOrderValue} onChange={(e) => setForm({ ...form, minimumOrderValue: e.target.value })} className={inputClass} /></label>
                    <label className="text-xs font-bold text-gray-600">Starts at<DatePicker selected={form.startsAt} onChange={(date) => setForm({ ...form, startsAt: date })} showTimeSelect dateFormat="dd MMM yyyy, h:mm aa" minDate={new Date()} className={inputClass} wrapperClassName="mt-1 w-full" required /></label>
                    <label className="text-xs font-bold text-gray-600">Expires at<DatePicker selected={form.expiresAt} onChange={(date) => setForm({ ...form, expiresAt: date })} showTimeSelect dateFormat="dd MMM yyyy, h:mm aa" minDate={form.startsAt || new Date()} className={inputClass} wrapperClassName="mt-1 w-full" required /></label>
                    <label className="text-xs font-bold text-gray-600">Usage limit <span className="font-normal text-gray-400">(optional)</span><input type="number" min="1" placeholder="Unlimited" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className={inputClass} /></label>
                    <button disabled={saving} className="self-end rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-gray-400">{saving ? 'Creating...' : 'Create promo code'}</button>
                </div>
            </form>

            {loading ? <div className="py-12"><LogoLoader label="Loading promo codes..." compact /></div> : promos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"><TagIcon className="mx-auto h-10 w-10 text-gray-300" /><h2 className="mt-3 font-bold text-gray-700">No promo codes yet</h2><p className="mt-1 text-sm text-gray-500">Create your first promotion above.</p></div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {promos.map((promo) => {
                        const active = promo.isActive && new Date() >= new Date(promo.startsAt) && new Date() <= new Date(promo.expiresAt) && (!promo.usageLimit || promo.usedCount < promo.usageLimit);
                        return <div key={promo._id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div className="flex items-center gap-2"><TagIcon className="h-5 w-5 text-blue-600" /><strong className="text-lg text-gray-800">{promo.code}</strong></div><button type="button" onClick={() => handleDelete(promo._id)} aria-label={`Delete ${promo.code}`} className="rounded-full p-2 text-red-500 transition hover:bg-red-50"><TrashIcon className="h-5 w-5" /></button></div><span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{active ? 'Active now' : 'Inactive'}</span><p className="mt-4 text-2xl font-bold text-blue-600">{promo.discountType === 'percentage' ? `${promo.discountValue}% off` : `₹${promo.discountValue} off`}</p><p className="mt-2 text-sm text-gray-500">Minimum order: ₹{promo.minimumOrderValue.toFixed(2)}</p><p className="mt-1 text-sm text-gray-500">{new Date(promo.startsAt).toLocaleDateString()} to {new Date(promo.expiresAt).toLocaleDateString()}</p><p className="mt-1 text-sm font-semibold text-gray-600">Used {promo.usedCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ' times'}</p></div>;
                    })}
                </div>
            )}
        </div>
    );
}
