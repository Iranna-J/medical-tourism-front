import { useState, useEffect, useRef } from 'react';
import {
    Upload, FileText, Download, Trash2,
    Calendar, File, AlertCircle, CheckCircle, X
} from 'lucide-react';
import { medicalReportService, type MedicalReport } from '../../services/medicalReportService';
import toast from 'react-hot-toast';

export default function MedicalReports() {
    const [reports, setReports] = useState<MedicalReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [reportType, setReportType] = useState('');
    const [description, setDescription] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const reportTypes = [
        'Blood Test',
        'X-Ray',
        'MRI Scan',
        'CT Scan',
        'Ultrasound',
        'ECG',
        'Prescription',
        'Medical History',
        'Discharge Summary',
        'Other',
    ];

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            setLoading(true);
            const data = await medicalReportService.getMyReports();
            setReports(data);
        } catch (error) {
            console.error('Error loading reports:', error);
            toast.error('Failed to load medical reports');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Only PDF and image files (JPEG, PNG) are allowed');
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !reportType) {
            toast.error('Please select a file and report type');
            return;
        }

        try {
            setUploading(true);
            await medicalReportService.uploadReport(selectedFile, reportType, description);
            toast.success('Report uploaded successfully');
            setShowUploadModal(false);
            setSelectedFile(null);
            setReportType('');
            setDescription('');
            loadReports();
        } catch (error) {
            console.error('Error uploading report:', error);
            toast.error('Failed to upload report');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this report?')) {
            return;
        }

        try {
            await medicalReportService.deleteReport(id);
            toast.success('Report deleted successfully');
            loadReports();
        } catch (error) {
            console.error('Error deleting report:', error);
            toast.error('Failed to delete report');
        }
    };

    const handleDownload = async (id: number, fileName: string) => {
        try {
            const blob = await medicalReportService.downloadReport(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success('Download started');
        } catch (error) {
            console.error('Error downloading report:', error);
            toast.error('Failed to download report');
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
        if (fileType.includes('image')) return <File className="h-8 w-8 text-blue-500" />;
        return <File className="h-8 w-8 text-gray-500" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
                    <p className="text-gray-600 mt-1">Upload and manage your medical documents</p>
                </div>
                <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                >
                    <Upload className="h-5 w-5" />
                    Upload Report
                </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Supported file formats:</p>
                        <p>PDF, JPEG, PNG (Max size: 10MB)</p>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                            <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            ) : reports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div key={report.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                            <div className="flex items-start justify-between mb-4">
                                {getFileIcon(report.fileType)}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleDownload(report.id, report.fileName)}
                                        className="p-2 text-gray-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                                        title="Download"
                                    >
                                        <Download className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(report.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="font-semibold text-gray-900 mb-2 truncate" title={report.fileName}>
                                {report.fileName}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    <span>{report.reportType}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(report.uploadedAt)}</span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    {formatFileSize(report.fileSize)}
                                </div>
                            </div>

                            {report.description && (
                                <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                    {report.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Medical Reports</h3>
                    <p className="text-gray-600 mb-6">
                        Upload your medical reports to share with doctors and hospitals
                    </p>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                    >
                        <Upload className="h-5 w-5" />
                        Upload Your First Report
                    </button>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center justify-between p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-900">Upload Medical Report</h2>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setReportType('');
                                    setDescription('');
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select File *
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-500 transition text-center"
                                >
                                    {selectedFile ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                            <span className="text-gray-900">{selectedFile.name}</span>
                                        </div>
                                    ) : (
                                        <div>
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600">Click to select file</p>
                                            <p className="text-xs text-gray-500 mt-1">PDF, JPEG, PNG (Max 10MB)</p>
                                        </div>
                                    )}
                                </button>
                            </div>

                            {/* Report Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Report Type *
                                </label>
                                <select
                                    value={reportType}
                                    onChange={(e) => setReportType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                >
                                    <option value="">Select Type</option>
                                    {reportTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    placeholder="Add any notes about this report..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 p-6 border-t">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setReportType('');
                                    setDescription('');
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!selectedFile || !reportType || uploading}
                                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
