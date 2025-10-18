import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Activity } from 'lucide-react';
import { adminService } from '../../services/adminService';
import type { Treatment } from '../../types';

export default function ManageTreatments() {
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);

    useEffect(() => {
        loadTreatments();
    }, []);

    const loadTreatments = async () => {
        try {
            setLoading(true);
            const data = await adminService.treatments.getAll();
            setTreatments(data.content);
        } catch (error) {
            console.error('Failed to load treatments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this treatment?')) return;

        try {
            await adminService.treatments.delete(id);
            await loadTreatments();
        } catch (error) {
            console.error('Failed to delete treatment:', error);
            alert('Failed to delete treatment');
        }
    };

    const handleEdit = (treatment: Treatment) => {
        setEditingTreatment(treatment);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTreatment(null);
    };

    const handleSaveSuccess = () => {
        handleCloseForm();
        loadTreatments();
    };

    const filteredTreatments = treatments.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Treatments</h1>
                    <p className="text-gray-600 mt-1">Add, edit, or remove treatments</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                >
                    <Plus className="h-5 w-5" />
                    Add Treatment
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search treatments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTreatments.map((treatment) => (
                    <div key={treatment.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                        <div className="flex items-start justify-between mb-4">
                            <Activity className="h-12 w-12 text-green-600" />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(treatment)}
                                    className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition"
                                >
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(treatment.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{treatment.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{treatment.description}</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Category:</span>
                                <span className="font-semibold text-gray-900">{treatment.category}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Duration:</span>
                                <span className="font-semibold text-gray-900">{treatment.durationDays} days</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">Price Range:</span>
                                <span className="font-semibold text-green-600">
                                    ${treatment.costEstimateMin} - ${treatment.costEstimateMax}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTreatments.length === 0 && (
                <div className="text-center py-12 text-gray-500">No treatments found</div>
            )}

            {showForm && (
                <TreatmentForm
                    treatment={editingTreatment}
                    onClose={handleCloseForm}
                    onSuccess={handleSaveSuccess}
                />
            )}
        </div>
    );
}

function TreatmentForm({ treatment, onClose, onSuccess }: {
    treatment: Treatment | null;
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [formData, setFormData] = useState({
        name: treatment?.name || '',
        description: treatment?.description || '',
        category: treatment?.category || '',
        durationDays: treatment?.durationDays || 0,
        costEstimateMin: treatment?.costEstimateMin || 0,
        costEstimateMax: treatment?.costEstimateMax || 0,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (treatment) {
                await adminService.treatments.update(treatment.id, formData);
            } else {
                await adminService.treatments.create(formData);
            }
            onSuccess();
        } catch (error) {
            console.error('Failed to save treatment:', error);
            alert('Failed to save treatment');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        {treatment ? 'Edit Treatment' : 'Add Treatment'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <input
                                type="text"
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days) *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="e.g., 7"
                                value={formData.durationDays}
                                onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Cost ($) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.costEstimateMin}
                                onChange={(e) => setFormData({ ...formData, costEstimateMin: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Cost ($) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.costEstimateMax}
                                onChange={(e) => setFormData({ ...formData, costEstimateMax: parseFloat(e.target.value) })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Treatment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
