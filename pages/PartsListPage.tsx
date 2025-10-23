import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Part, Role } from '../types';
import Modal from '../components/Modal';
import QRCodeComponent from '../components/QRCodeComponent';

// Part Form Component (for Add/Edit)
const PartForm: React.FC<{
  part?: Part;
  onSave: (partData: Omit<Part, 'id' | 'qrCode'> | Part) => void;
  onCancel: () => void;
}> = ({ part, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: part?.name || '',
    sku: part?.sku || '',
    description: part?.description || '',
    quantity: part?.quantity ?? 0,
    reorderThreshold: part?.reorderThreshold ?? 0,
    location: part?.location || '',
    category: part?.category || '',
    imageUrl: part?.imageUrl || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumber = ['quantity', 'reorderThreshold'].includes(name);
    setFormData(prev => ({ ...prev, [name]: isNumber ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (part) {
      onSave({ ...part, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">Part Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-slate-700">SKU</label>
          <input type="text" name="sku" id="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
        </div>
      </div>
       <div>
        <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
        <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
      </div>
      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL</label>
        <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity</label>
          <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} min="0" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
        </div>
        <div>
          <label htmlFor="reorderThreshold" className="block text-sm font-medium text-slate-700">Reorder Threshold</label>
          <input type="number" name="reorderThreshold" id="reorderThreshold" value={formData.reorderThreshold} onChange={handleChange} min="0" required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
        </div>
      </div>
       <div>
        <label htmlFor="location" className="block text-sm font-medium text-slate-700">Location</label>
        <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"/>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Part</button>
      </div>
    </form>
  );
};

// Part Detail Modal
const PartDetailModal: React.FC<{ part: Part; onClose: () => void }> = ({ part, onClose }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title={part.name}>
        <div className="space-y-4">
            {part.imageUrl && <img src={part.imageUrl} alt={part.name} className="w-full h-48 object-cover rounded-lg mb-4" />}
            <div className="flex flex-col sm:flex-row justify-between">
                <div>
                    <p><span className="font-semibold text-slate-600">SKU:</span> {part.sku}</p>
                    <p><span className="font-semibold text-slate-600">Category:</span> {part.category}</p>
                    <p><span className="font-semibold text-slate-600">Location:</span> {part.location}</p>
                    <p><span className="font-semibold text-slate-600">Quantity:</span> {part.quantity}</p>
                    <p><span className="font-semibold text-slate-600">Threshold:</span> {part.reorderThreshold}</p>
                </div>
                <div className="mt-4 sm:mt-0 self-center">
                    <QRCodeComponent value={part.qrCode} />
                </div>
            </div>
             <div>
                <p className="font-semibold text-slate-600">Description:</p>
                <p className="text-slate-800">{part.description}</p>
            </div>
        </div>
    </Modal>
  );
};

// Quantity Modal (for Add Stock / Checkout)
const QuantityModal: React.FC<{
    part: Part;
    mode: 'add' | 'checkout';
    onConfirm: (quantity: number) => void;
    onCancel: () => void;
}> = ({ part, mode, onConfirm, onCancel }) => {
    const [quantity, setQuantity] = useState(1);
    const title = mode === 'add' ? 'Add Stock' : 'Check Out';
    const buttonLabel = mode === 'add' ? 'Add to Stock' : 'Confirm Checkout';
    const max = mode === 'checkout' ? part.quantity : undefined;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(quantity);
    };

    return (
        <Modal isOpen={true} onClose={onCancel} title={`${title}: ${part.name}`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <p>Current Quantity: <span className="font-bold">{part.quantity}</span></p>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-slate-700">Quantity to {mode}</label>
                    <input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        min="1"
                        max={max}
                        required
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-200 rounded-lg hover:bg-slate-300">Cancel</button>
                    <button type="submit" className={`px-4 py-2 text-white rounded-lg ${mode === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{buttonLabel}</button>
                </div>
            </form>
        </Modal>
    );
};


const PartsListPage: React.FC = () => {
  const { parts, addPart, updatePart, deletePart, checkOutPart, addStock, currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | undefined>(undefined);
  const [viewingPart, setViewingPart] = useState<Part | undefined>(undefined);
  const [addStockPart, setAddStockPart] = useState<Part | undefined>(undefined);
  const [checkoutPart, setCheckoutPart] = useState<Part | undefined>(undefined);
  const [mobileView, setMobileView] = useState<'basic' | 'extended'>('basic');

  const isAdmin = currentUser?.role === Role.Admin;
  const isManager = currentUser?.role === Role.Manager;
  const canPerformActions = currentUser?.role === Role.Admin || currentUser?.role === Role.Technician;
  const canExport = isAdmin || isManager;

  const filteredParts = useMemo(() => {
    return parts
      .filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [parts, searchTerm]);
  
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Description', 'Quantity', 'Reorder Threshold', 'Location', 'Category', 'Image URL', 'QR Code'];
    
    const rows = filteredParts.map(part => [
        part.id,
        `"${part.name.replace(/"/g, '""')}"`,
        part.sku,
        `"${part.description.replace(/"/g, '""')}"`,
        part.quantity,
        part.reorderThreshold,
        `"${part.location.replace(/"/g, '""')}"`,
        `"${part.category.replace(/"/g, '""')}"`,
        part.imageUrl || '',
        part.qrCode
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "parts_inventory.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenFormModal = (part?: Part) => {
    setEditingPart(part);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setEditingPart(undefined);
    setIsFormModalOpen(false);
  };

  const handleSavePart = (partData: Omit<Part, 'id' | 'qrCode'> | Part) => {
    if ('id' in partData) {
      updatePart(partData.id, partData);
    } else {
      addPart(partData);
    }
    handleCloseFormModal();
  };

  const handleConfirmCheckout = (quantity: number) => {
      if (checkoutPart && currentUser) {
          checkOutPart(checkoutPart.id, quantity, currentUser.id);
      }
      setCheckoutPart(undefined);
  };

  const handleConfirmAddStock = (quantity: number) => {
      if (addStockPart && currentUser) {
          addStock(addStockPart.id, quantity, currentUser.id);
      }
      setAddStockPart(undefined);
  }

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Parts Inventory</h1>
         <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            {canExport && (
                <button
                    onClick={exportToCSV}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-sm"
                >
                    Export CSV
                </button>
            )}
            {isAdmin && (
                <button
                onClick={() => handleOpenFormModal()}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm"
                >
                Add New Part
                </button>
            )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, SKU, category..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full max-w-sm px-4 py-2 border rounded-lg shadow-sm"
        />
      </div>

      {/* Mobile View Toggle */}
      <div className="md:hidden mb-4">
          <div className="flex bg-slate-200 rounded-lg p-1">
              <button onClick={() => setMobileView('basic')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition ${mobileView === 'basic' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}>Basic View</button>
              <button onClick={() => setMobileView('extended')} className={`w-1/2 py-2 text-sm font-semibold rounded-md transition ${mobileView === 'extended' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'}`}>Extended View</button>
          </div>
      </div>

      {/* Desktop Table View */}
      <div className="bg-white shadow rounded-lg overflow-x-auto hidden md:block">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-100">
            <tr>
              <th className="px-6 py-3">Part Name</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3 text-center">Quantity</th>
              <th className="px-6 py-3 text-center">Threshold</th>
              <th className="px-6 py-3">QR Code</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredParts.map(part => (
              <tr key={part.id} className={`border-b hover:bg-slate-50 ${part.quantity <= part.reorderThreshold ? 'bg-amber-50' : ''}`}>
                <td className="px-6 py-4 font-medium text-slate-900">{part.name}</td>
                <td className="px-6 py-4 font-mono text-xs">{part.sku}</td>
                <td className="px-6 py-4">{part.category}</td>
                <td className="px-6 py-4">{part.location}</td>
                <td className={`px-6 py-4 text-center font-bold ${part.quantity <= part.reorderThreshold ? 'text-amber-600' : 'text-slate-800'}`}>{part.quantity}</td>
                <td className="px-6 py-4 text-center">{part.reorderThreshold}</td>
                <td className="px-6 py-4 font-mono text-xs">{part.qrCode}</td>
                <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                  <button onClick={() => setViewingPart(part)} className="font-medium text-blue-600 hover:underline">View</button>
                  {isAdmin && <button onClick={() => setAddStockPart(part)} className="font-medium text-green-600 hover:underline">Add</button>}
                  {canPerformActions && <button onClick={() => setCheckoutPart(part)} className="font-medium text-orange-600 hover:underline">Checkout</button>}
                  {isAdmin && <button onClick={() => handleOpenFormModal(part)} className="font-medium text-indigo-600 hover:underline">Edit</button>}
                  {isAdmin && <button onClick={() => deletePart(part.id)} className="font-medium text-red-600 hover:underline">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredParts.length === 0 && <p className="p-6 text-center text-slate-500">No parts found.</p>}
      </div>
      
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
         {filteredParts.map(part => (
            <div key={part.id} className={`bg-white rounded-lg shadow p-4 space-y-3 ${part.quantity <= part.reorderThreshold ? 'border-l-4 border-amber-400' : ''}`}>
                {mobileView === 'extended' && part.imageUrl && (
                    <img src={part.imageUrl} alt={part.name} className="w-full h-32 object-cover rounded-md mb-2" />
                )}
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800 pr-2">{part.name}</h3>
                    <div className={`text-right flex-shrink-0 ${part.quantity <= part.reorderThreshold ? 'text-amber-600' : 'text-slate-800'}`}>
                        <span className="font-bold text-xl">{part.quantity}</span>
                        <p className="text-xs">in stock</p>
                    </div>
                </div>
                 <p className="text-sm text-slate-500">{part.category}</p>
                 {mobileView === 'extended' && (
                     <div className="text-xs text-slate-500 space-y-1 pt-2 border-t">
                        <p><span className="font-semibold">SKU:</span> {part.sku}</p>
                        <p><span className="font-semibold">Location:</span> {part.location}</p>
                        <p><span className="font-semibold">Reorder At:</span> {part.reorderThreshold}</p>
                     </div>
                 )}
                 <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <button onClick={() => setViewingPart(part)} className="text-sm font-medium text-blue-600">View</button>
                    {isAdmin && <button onClick={() => setAddStockPart(part)} className="text-sm font-medium text-green-600">Add</button>}
                    {canPerformActions && <button onClick={() => setCheckoutPart(part)} className="text-sm font-medium text-orange-600">Checkout</button>}
                    {isAdmin && <button onClick={() => handleOpenFormModal(part)} className="text-sm font-medium text-indigo-600">Edit</button>}
                    {isAdmin && <button onClick={() => deletePart(part.id)} className="text-sm font-medium text-red-600">Delete</button>}
                 </div>
            </div>
         ))}
      </div>


      {isFormModalOpen && (
        <Modal isOpen={isFormModalOpen} onClose={handleCloseFormModal} title={editingPart ? 'Edit Part' : 'Add New Part'}>
          <PartForm part={editingPart} onSave={handleSavePart} onCancel={handleCloseFormModal} />
        </Modal>
      )}

      {viewingPart && <PartDetailModal part={viewingPart} onClose={() => setViewingPart(undefined)} />}
      
      {addStockPart && <QuantityModal part={addStockPart} mode="add" onConfirm={handleConfirmAddStock} onCancel={() => setAddStockPart(undefined)} />}
      
      {checkoutPart && <QuantityModal part={checkoutPart} mode="checkout" onConfirm={handleConfirmCheckout} onCancel={() => setCheckoutPart(undefined)} />}
    </div>
  );
};

export default PartsListPage;