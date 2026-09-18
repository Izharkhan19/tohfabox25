import React, { useState, useEffect } from 'react';
import { getCustomRequests, updateCustomRequestStatus, deleteCustomRequest } from '../../api-services/apiService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import {
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

export default function CustomRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    const res = await getCustomRequests();
    if (res?.success) {
      setRequests(res.data?.data || res.data || []);
    } else {
      toast.error('Failed to fetch custom requests');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    const res = await deleteCustomRequest(id);
    if (res?.success) {
      toast.success("Request deleted successfully");
      setRequests(requests.filter((r) => r._id !== id));
    } else {
      toast.error("Failed to delete request");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await updateCustomRequestStatus(id, newStatus);
    if (res?.success) {
      toast.success("Status updated successfully");
      setRequests(requests.map(r => r._id === id ? { ...r, status: newStatus } : r));
    } else {
      toast.error("Failed to update status");
    }
  };

  const statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Reviewed', value: 'Reviewed' },
    { label: 'Closed', value: 'Closed' }
  ];

  const statusBodyTemplate = (rowData) => {
    return (
      <Dropdown 
        value={rowData.status} 
        options={statusOptions} 
        onChange={(e) => handleStatusChange(rowData._id, e.value)} 
        className="w-full md:w-32 text-sm" 
        style={{ padding: '0.25rem 0.5rem' }}
      />
    );
  };

  const getDateInFormat = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Custom Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage custom orders and inquiries from clients</p>
        </div>
        <div className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200">
          <span className="text-sm font-semibold text-gray-600">Total Requests: <span className="text-gray-900">{requests.length}</span></span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium">No custom requests found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <DataTable
              value={requests}
              paginator
              rows={10}
              tableStyle={{ minWidth: '60rem' }}
              className="p-datatable-sm"
              rowHover
              stripedRows
            >
              <Column field="type" header="Type" sortable body={(r) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${r.type === 'Custom Order' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {r.type}
                </span>
              )}></Column>
              <Column header="Image" body={(r) => (
                r.referenceImage?.url ? (
                  <img 
                    src={r.referenceImage.url} 
                    alt="Reference" 
                    className="w-10 h-10 object-cover rounded shadow-sm cursor-pointer hover:opacity-80 transition"
                    onClick={() => setPreviewImage(r.referenceImage.url)}
                  />
                ) : <span className="text-gray-400 text-xs italic">None</span>
              )}></Column>
              <Column field="name" header="Name" sortable></Column>
              <Column field="email" header="Email" sortable></Column>
              <Column field="phone" header="Phone" sortable></Column>
              <Column header="Status" body={statusBodyTemplate}></Column>
              <Column field="createdAt" header="Date" body={(r) => getDateInFormat(r.createdAt)} sortable></Column>
              <Column header="Actions" body={(rowData) => {
                const phoneStr = rowData.phone ? String(rowData.phone).replace(/[^0-9]/g, '') : null;
                return (
                  <div className="flex gap-2">
                    <a href={`mailto:${rowData.email}`} className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition shadow-sm border border-gray-200" title="Email">
                      <EnvelopeIcon className="w-4 h-4" />
                    </a>
                    {phoneStr && (
                      <a href={`tel:${phoneStr}`} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition shadow-sm border border-blue-200" title="Call">
                        <PhoneIcon className="w-4 h-4" />
                      </a>
                    )}
                    {phoneStr && (
                      <a href={`https://wa.me/${phoneStr}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition shadow-sm border border-green-200" title="WhatsApp">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </a>
                    )}
                    <button onClick={() => handleDelete(rowData._id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition shadow-sm border border-red-200" title="Delete">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                );
              }}></Column>
            </DataTable>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden flex flex-col gap-4">
            {requests.map((r) => {
              const phoneStr = r.phone ? String(r.phone).replace(/[^0-9]/g, '') : null;
              return (
              <div key={r._id} className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{r.name}</h3>
                    <p className="text-xs text-gray-500">{getDateInFormat(r.createdAt)}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${r.type === 'Custom Order' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {r.type}
                  </span>
                </div>

                <div className="space-y-1.5 border-y border-gray-50 py-3">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{r.email}</span>
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    {r.phone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Message</p>
                  <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-100 line-clamp-3">
                    {r.message}
                  </p>
                </div>

                {r.referenceImage?.url && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Reference Image</p>
                    <img 
                      src={r.referenceImage.url} 
                      alt="Reference" 
                      className="w-full h-32 object-cover rounded-xl border border-gray-100 cursor-pointer shadow-sm hover:opacity-80 transition"
                      onClick={() => setPreviewImage(r.referenceImage.url)}
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                    <Dropdown 
                      value={r.status} 
                      options={statusOptions} 
                      onChange={(e) => handleStatusChange(r._id, e.value)} 
                      className="w-32 text-xs" 
                      style={{ padding: '0.25rem 0.5rem' }}
                    />
                  </div>
                </div>

                {/* Follow up Action Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-2 pt-3 border-t border-gray-100">
                  <a href={`mailto:${r.email}`} className="flex flex-col items-center justify-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition border border-gray-200">
                    <EnvelopeIcon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Email</span>
                  </a>
                  
                  <a href={phoneStr ? `tel:${phoneStr}` : '#'} className={`flex flex-col items-center justify-center py-2 rounded-xl transition border ${phoneStr ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-400 border-gray-200 pointer-events-none'}`}>
                    <PhoneIcon className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold uppercase">Call</span>
                  </a>
                  
                  <a href={phoneStr ? `https://wa.me/${phoneStr}` : '#'} target={phoneStr ? "_blank" : "_self"} rel="noopener noreferrer" className={`flex flex-col items-center justify-center py-2 rounded-xl transition border ${phoneStr ? 'bg-green-50 hover:bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 pointer-events-none'}`}>
                    <svg className="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span className="text-[10px] font-bold uppercase">Chat</span>
                  </a>
                </div>

                <button onClick={() => handleDelete(r._id)} className="mt-2 w-full flex justify-center items-center gap-2 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold uppercase text-xs tracking-wider border border-red-200 shadow-sm active:bg-red-100 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                  Delete Request
                </button>
              </div>
            )})}
          </div>
        </>
      )}

      {/* Image Preview Modal */}
      <Dialog 
        header="Reference Image" 
        visible={!!previewImage} 
        style={{ width: '90vw', maxWidth: '600px' }} 
        onHide={() => setPreviewImage(null)} 
        dismissableMask
      >
        <div className="flex justify-center p-2 bg-gray-50 rounded-lg">
          <img src={previewImage} alt="Preview" className="max-w-full h-auto max-h-[70vh] object-contain rounded shadow-sm" />
        </div>
      </Dialog>
    </div>
  );
}
