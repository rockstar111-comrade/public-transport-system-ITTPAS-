// // // //src/components/meeseva/MeesevaDashboard.tsx
// // // import { useState, useEffect } from 'react';
// // // import { CheckCircle, Clock, XCircle, Download, LogOut } from 'lucide-react';
// // // import { supabase } from '../../lib/supabase';
// // // import { useAuth } from '../../contexts/AuthContext';

// // // interface VerificationRequest {
// // //   id: string;
// // //   passenger_id: string;
// // //   aadhaar_number: string;
// // //   aadhaar_image_url: string | null;
// // //   status: 'pending' | 'approved' | 'rejected';
// // //   created_at: string;
// // //   verified_at: string | null;
// // //   passenger?: {
// // //     full_name: string;
// // //     phone: string | null;
// // //     email: string;
// // //   };
// // // }

// // // export function MeesevaDashboard() {
// // //   const [requests, setRequests] = useState<VerificationRequest[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
// // //   const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
// // //   const [uploadingImage, setUploadingImage] = useState<string | null>(null);
// // //   const { profile, signOut } = useAuth();

// // //   useEffect(() => {
// // //     fetchVerificationRequests();
// // //   }, [filter]);

// // //   const fetchVerificationRequests = async () => {
// // //     setLoading(true);
// // //     try {
// // //       let query = supabase
// // //         .from('aadhaar_verifications')
// // //         .select(
// // //           `
// // //           id,
// // //           passenger_id,
// // //           aadhaar_number,
// // //           aadhaar_image_url,
// // //           status,
// // //           created_at,
// // //           verified_at,
// // //           profiles:passenger_id (full_name, phone),
// // //           auth.users!passenger_id (email)
// // //         `
// // //         );

// // //       if (filter !== 'all') {
// // //         query = query.eq('status', filter);
// // //       }

// // //       const { data, error } = await query.order('created_at', { ascending: false });

// // //       if (error) throw error;

// // //       const formatted = (data || []).map((item: any) => ({
// // //         id: item.id,
// // //         passenger_id: item.passenger_id,
// // //         aadhaar_number: item.aadhaar_number,
// // //         aadhaar_image_url: item.aadhaar_image_url,
// // //         status: item.status,
// // //         created_at: item.created_at,
// // //         verified_at: item.verified_at,
// // //         passenger: {
// // //           full_name: item.profiles?.full_name || 'Unknown',
// // //           phone: item.profiles?.phone || 'N/A',
// // //           email: item.auth?.email || 'N/A',
// // //         },
// // //       }));

// // //       setRequests(formatted);
// // //     } catch (error) {
// // //       console.error('Error fetching requests:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleImageUpload = async (
// // //     e: React.ChangeEvent<HTMLInputElement>,
// // //     requestId: string
// // //   ) => {
// // //     const file = e.target.files?.[0];
// // //     if (!file || !profile?.id) return;

// // //     setUploadingImage(requestId);

// // //     try {
// // //       const fileName = `aadhaar-${requestId}-${Date.now()}`;
// // //       const { error: uploadError } = await supabase.storage
// // //         .from('aadhaar-documents')
// // //         .upload(fileName, file);

// // //       if (uploadError) throw uploadError;

// // //       const { data } = supabase.storage.from('aadhaar-documents').getPublicUrl(fileName);

// // //       const { error: updateError } = await supabase
// // //         .from('aadhaar_verifications')
// // //         .update({
// // //           aadhaar_image_url: data.publicUrl,
// // //           status: 'approved',
// // //           verified_by: profile.id,
// // //           verified_at: new Date().toISOString(),
// // //         })
// // //         .eq('id', requestId);

// // //       if (updateError) throw updateError;

// // //       const { error: profileError } = await supabase
// // //         .from('profiles')
// // //         .update({ is_verified_woman: true })
// // //         .eq('id', (requests.find((r) => r.id === requestId)?.passenger_id || ''));

// // //       if (profileError) throw profileError;

// // //       await fetchVerificationRequests();
// // //       setSelectedRequest(null);
// // //     } catch (error) {
// // //       console.error('Error uploading document:', error);
// // //       alert('Failed to upload document. Please try again.');
// // //     } finally {
// // //       setUploadingImage(null);
// // //     }
// // //   };

// // //   const rejectRequest = async (requestId: string) => {
// // //     if (!confirm('Are you sure you want to reject this request?')) return;

// // //     try {
// // //       const { error } = await supabase
// // //         .from('aadhaar_verifications')
// // //         .update({
// // //           status: 'rejected',
// // //           verified_by: profile?.id,
// // //           verified_at: new Date().toISOString(),
// // //         })
// // //         .eq('id', requestId);

// // //       if (error) throw error;

// // //       await fetchVerificationRequests();
// // //       setSelectedRequest(null);
// // //     } catch (error) {
// // //       console.error('Error rejecting request:', error);
// // //       alert('Failed to reject request');
// // //     }
// // //   };

// // //   const handleLogout = async () => {
// // //     try {
// // //       await signOut();
// // //     } catch (error) {
// // //       console.error('Logout failed:', error);
// // //     }
// // //   };

// // //   const getStatusBadge = (status: string) => {
// // //     switch (status) {
// // //       case 'pending':
// // //         return (
// // //           <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
// // //             <Clock className="w-4 h-4" />
// // //             <span>Pending</span>
// // //           </div>
// // //         );
// // //       case 'approved':
// // //         return (
// // //           <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
// // //             <CheckCircle className="w-4 h-4" />
// // //             <span>Approved</span>
// // //           </div>
// // //         );
// // //       case 'rejected':
// // //         return (
// // //           <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
// // //             <XCircle className="w-4 h-4" />
// // //             <span>Rejected</span>
// // //           </div>
// // //         );
// // //       default:
// // //         return null;
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen bg-gray-50">
// // //       <nav className="bg-purple-700 shadow-lg">
// // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //           <div className="flex justify-between items-center h-16">
// // //             <div className="flex items-center space-x-3">
// // //               <div className="bg-white p-2 rounded-lg">
// // //                 <CheckCircle className="w-6 h-6 text-purple-700" />
// // //               </div>
// // //               <div>
// // //                 <h1 className="text-xl font-bold text-white">Smart Transport</h1>
// // //                 <p className="text-xs text-purple-100">MeeSeva Portal</p>
// // //               </div>
// // //             </div>

// // //             <div className="flex items-center space-x-4">
// // //               <span className="text-sm text-white font-medium hidden sm:inline">
// // //                 {profile?.full_name}
// // //               </span>
// // //               <button
// // //                 onClick={handleLogout}
// // //                 className="flex items-center space-x-2 px-4 py-2 bg-purple-800 hover:bg-purple-900 rounded-lg transition text-white"
// // //               >
// // //                 <LogOut className="w-4 h-4" />
// // //                 <span className="text-sm font-medium">Logout</span>
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </nav>

// // //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
// // //         <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
// // //           <h2 className="text-2xl font-bold text-gray-900 mb-6">
// // //             Women Aadhaar Verification
// // //           </h2>

// // //           <div className="flex space-x-2 mb-6 overflow-x-auto">
// // //             {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
// // //               <button
// // //                 key={f}
// // //                 onClick={() => setFilter(f)}
// // //                 className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
// // //                   filter === f
// // //                     ? 'bg-purple-600 text-white'
// // //                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// // //                 }`}
// // //               >
// // //                 {f.charAt(0).toUpperCase() + f.slice(1)}
// // //               </button>
// // //             ))}
// // //           </div>
// // //         </div>

// // //         {loading ? (
// // //           <div className="bg-white rounded-xl shadow-sm p-8 text-center">
// // //             <p className="text-gray-600">Loading verification requests...</p>
// // //           </div>
// // //         ) : requests.length === 0 ? (
// // //           <div className="bg-white rounded-xl shadow-sm p-8 text-center">
// // //             <p className="text-gray-600">No verification requests in this category</p>
// // //           </div>
// // //         ) : (
// // //           <div className="space-y-4">
// // //             {requests.map((request) => (
// // //               <div
// // //                 key={request.id}
// // //                 className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
// // //               >
// // //                 <div className="flex items-start justify-between mb-4">
// // //                   <div>
// // //                     <h3 className="text-lg font-bold text-gray-900">
// // //                       {request.passenger?.full_name}
// // //                     </h3>
// // //                     <p className="text-sm text-gray-600 mt-1">
// // //                       Aadhaar: {request.aadhaar_number}
// // //                     </p>
// // //                   </div>
// // //                   {getStatusBadge(request.status)}
// // //                 </div>

// // //                 <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
// // //                   <div>
// // //                     <p className="text-gray-600">Phone</p>
// // //                     <p className="font-medium text-gray-900">{request.passenger?.phone}</p>
// // //                   </div>
// // //                   <div>
// // //                     <p className="text-gray-600">Email</p>
// // //                     <p className="font-medium text-gray-900 break-all">
// // //                       {request.passenger?.email}
// // //                     </p>
// // //                   </div>
// // //                   <div>
// // //                     <p className="text-gray-600">Applied</p>
// // //                     <p className="font-medium text-gray-900">
// // //                       {new Date(request.created_at).toLocaleDateString()}
// // //                     </p>
// // //                   </div>
// // //                   {request.verified_at && (
// // //                     <div>
// // //                       <p className="text-gray-600">Verified</p>
// // //                       <p className="font-medium text-gray-900">
// // //                         {new Date(request.verified_at).toLocaleDateString()}
// // //                       </p>
// // //                     </div>
// // //                   )}
// // //                 </div>

// // //                 {request.status === 'approved' && request.aadhaar_image_url && (
// // //                   <div className="mb-4">
// // //                     <p className="text-sm font-medium text-gray-700 mb-2">
// // //                       Uploaded Document
// // //                     </p>
// // //                     <img
// // //                       src={request.aadhaar_image_url}
// // //                       alt="Aadhaar Document"
// // //                       className="max-w-xs h-auto rounded border border-gray-200"
// // //                     />
// // //                   </div>
// // //                 )}

// // //                 {request.status === 'pending' && (
// // //                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
// // //                     <p className="text-sm text-blue-800 mb-4">
// // //                       Upload Aadhaar document to approve this application
// // //                     </p>
// // //                     <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition">
// // //                       <input
// // //                         type="file"
// // //                         accept="image/*"
// // //                         onChange={(e) => handleImageUpload(e, request.id)}
// // //                         className="hidden"
// // //                         disabled={uploadingImage === request.id}
// // //                       />
// // //                       <div className="flex items-center space-x-2 text-blue-600">
// // //                         <Download className="w-5 h-5" />
// // //                         <span className="font-medium">
// // //                           {uploadingImage === request.id
// // //                             ? 'Uploading...'
// // //                             : 'Click to upload Aadhaar image'}
// // //                         </span>
// // //                       </div>
// // //                     </label>
// // //                   </div>
// // //                 )}

// // //                 {request.status === 'pending' && (
// // //                   <div className="flex space-x-3">
// // //                     <button
// // //                       onClick={() => setSelectedRequest(request)}
// // //                       className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
// // //                     >
// // //                       View Details
// // //                     </button>
// // //                     <button
// // //                       onClick={() => rejectRequest(request.id)}
// // //                       className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
// // //                     >
// // //                       Reject
// // //                     </button>
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // src/components/meeseva/MeesevaDashboard.tsx
// // import { useState, useEffect } from 'react';
// // import { CheckCircle, Clock, XCircle, Download, LogOut } from 'lucide-react';
// // import { supabase } from '../../lib/supabase';
// // import { useAuth } from '../../contexts/AuthContext';

// // interface VerificationRequest {
// //   id: string;
// //   passenger_id: string;
// //   aadhaar_number: string;
// //   aadhaar_image_url: string | null;
// //   status: 'pending' | 'approved' | 'rejected';
// //   created_at: string;
// //   verified_at: string | null;
// //   passenger?: {
// //     full_name: string;
// //     phone: string | null;
// //     email: string;
// //   };
// // }

// // interface MeesevaDashboardProps {
// //   onGoHome: () => void;
// // }

// // export function MeesevaDashboard({ onGoHome }: MeesevaDashboardProps) {
// //   const [requests, setRequests] = useState<VerificationRequest[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filter, setFilter] =
// //     useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
// //   const [selectedRequest, setSelectedRequest] =
// //     useState<VerificationRequest | null>(null);
// //   const [uploadingImage, setUploadingImage] = useState<string | null>(null);

// //   const { profile, signOut } = useAuth();

// //   useEffect(() => {
// //     fetchVerificationRequests();
// //   }, [filter]);

// //   const fetchVerificationRequests = async () => {
// //     setLoading(true);
// //     try {
// //       let query = supabase
// //         .from('aadhaar_verifications')
// //         .select(
// //           `
// //           id,
// //           passenger_id,
// //           aadhaar_number,
// //           aadhaar_image_url,
// //           status,
// //           created_at,
// //           verified_at,
// //           profiles:passenger_id (full_name, phone),
// //           auth.users!passenger_id (email)
// //         `
// //         );

// //       if (filter !== 'all') {
// //         query = query.eq('status', filter);
// //       }

// //       const { data, error } = await query.order('created_at', { ascending: false });

// //       if (error) throw error;

// //       const formatted = (data || []).map((item: any) => ({
// //         id: item.id,
// //         passenger_id: item.passenger_id,
// //         aadhaar_number: item.aadhaar_number,
// //         aadhaar_image_url: item.aadhaar_image_url,
// //         status: item.status,
// //         created_at: item.created_at,
// //         verified_at: item.verified_at,
// //         passenger: {
// //           full_name: item.profiles?.full_name || 'Unknown',
// //           phone: item.profiles?.phone || 'N/A',
// //           email: item.auth?.email || 'N/A',
// //         },
// //       }));

// //       setRequests(formatted);
// //     } catch (error) {
// //       console.error('Error fetching requests:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleImageUpload = async (
// //     e: React.ChangeEvent<HTMLInputElement>,
// //     requestId: string
// //   ) => {
// //     const file = e.target.files?.[0];
// //     if (!file || !profile?.id) return;

// //     setUploadingImage(requestId);

// //     try {
// //       const fileName = `aadhaar-${requestId}-${Date.now()}`;
// //       const { error: uploadError } = await supabase.storage
// //         .from('aadhaar-documents')
// //         .upload(fileName, file);

// //       if (uploadError) throw uploadError;

// //       const { data } = supabase.storage
// //         .from('aadhaar-documents')
// //         .getPublicUrl(fileName);

// //       const { error: updateError } = await supabase
// //         .from('aadhaar_verifications')
// //         .update({
// //           aadhaar_image_url: data.publicUrl,
// //           status: 'approved',
// //           verified_by: profile.id,
// //           verified_at: new Date().toISOString(),
// //         })
// //         .eq('id', requestId);

// //       if (updateError) throw updateError;

// //       const { error: profileError } = await supabase
// //         .from('profiles')
// //         .update({ is_verified_woman: true })
// //         .eq(
// //           'id',
// //           requests.find((r) => r.id === requestId)?.passenger_id || ''
// //         );

// //       if (profileError) throw profileError;

// //       await fetchVerificationRequests();
// //       setSelectedRequest(null);
// //     } catch (error) {
// //       console.error('Error uploading document:', error);
// //       alert('Failed to upload document. Please try again.');
// //     } finally {
// //       setUploadingImage(null);
// //     }
// //   };

// //   const rejectRequest = async (requestId: string) => {
// //     if (!confirm('Are you sure you want to reject this request?')) return;

// //     try {
// //       const { error } = await supabase
// //         .from('aadhaar_verifications')
// //         .update({
// //           status: 'rejected',
// //           verified_by: profile?.id,
// //           verified_at: new Date().toISOString(),
// //         })
// //         .eq('id', requestId);

// //       if (error) throw error;

// //       await fetchVerificationRequests();
// //       setSelectedRequest(null);
// //     } catch (error) {
// //       console.error('Error rejecting request:', error);
// //       alert('Failed to reject request');
// //     }
// //   };

// //   const handleLogout = async () => {
// //     try {
// //       await signOut();
// //     } catch (error) {
// //       console.error('Logout failed:', error);
// //     }
// //   };

// //   const getStatusBadge = (status: string) => {
// //     switch (status) {
// //       case 'pending':
// //         return (
// //           <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
// //             <Clock className="w-4 h-4" />
// //             <span>Pending</span>
// //           </div>
// //         );
// //       case 'approved':
// //         return (
// //           <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
// //             <CheckCircle className="w-4 h-4" />
// //             <span>Approved</span>
// //           </div>
// //         );
// //       case 'rejected':
// //         return (
// //           <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
// //             <XCircle className="w-4 h-4" />
// //             <span>Rejected</span>
// //           </div>
// //         );
// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50">
// //       {/* ================= NAVBAR ================= */}
// //       <nav className="bg-purple-700 shadow-lg">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">

// //             {/* LOGO → HOME */}
// //             <button
// //               onClick={onGoHome}
// //               className="flex items-center space-x-3 hover:opacity-80 transition"
// //             >
// //               <div className="bg-white p-2 rounded-lg">
// //                 <CheckCircle className="w-6 h-6 text-purple-700" />
// //               </div>
// //               <div className="text-left">
// //                 <h1 className="text-xl font-bold text-white">
// //                   Smart Transport
// //                 </h1>
// //                 <p className="text-xs text-purple-100">
// //                   MeeSeva Portal
// //                 </p>
// //               </div>
// //             </button>

// //             {/* USER + LOGOUT */}
// //             <div className="flex items-center space-x-4">
// //               <span className="text-sm text-white font-medium hidden sm:inline">
// //                 {profile?.full_name}
// //               </span>
// //               <button
// //                 onClick={handleLogout}
// //                 className="flex items-center space-x-2 px-4 py-2 bg-purple-800 hover:bg-purple-900 rounded-lg transition text-white"
// //               >
// //                 <LogOut className="w-4 h-4" />
// //                 <span className="text-sm font-medium">Logout</span>
// //               </button>
// //             </div>

// //           </div>
// //         </div>
// //       </nav>

// //       {/* ================= CONTENT ================= */}
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

// //         <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
// //           <h2 className="text-2xl font-bold text-gray-900 mb-6">
// //             Women Aadhaar Verification
// //           </h2>

// //           <div className="flex space-x-2 mb-6 overflow-x-auto">
// //             {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
// //               <button
// //                 key={f}
// //                 onClick={() => setFilter(f)}
// //                 className={`px-6 py-2 rounded-lg font-medium transition whitespace-nowrap ${
// //                   filter === f
// //                     ? 'bg-purple-600 text-white'
// //                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
// //                 }`}
// //               >
// //                 {f.charAt(0).toUpperCase() + f.slice(1)}
// //               </button>
// //             ))}
// //           </div>
// //         </div>

// //         {loading ? (
// //           <div className="bg-white rounded-xl shadow-sm p-8 text-center">
// //             <p className="text-gray-600">Loading verification requests...</p>
// //           </div>
// //         ) : requests.length === 0 ? (
// //           <div className="bg-white rounded-xl shadow-sm p-8 text-center">
// //             <p className="text-gray-600">
// //               No verification requests in this category
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="space-y-4">
// //             {requests.map((request) => (
// //               <div
// //                 key={request.id}
// //                 className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
// //               >
// //                 <div className="flex items-start justify-between mb-4">
// //                   <div>
// //                     <h3 className="text-lg font-bold text-gray-900">
// //                       {request.passenger?.full_name}
// //                     </h3>
// //                     <p className="text-sm text-gray-600 mt-1">
// //                       Aadhaar: {request.aadhaar_number}
// //                     </p>
// //                   </div>
// //                   {getStatusBadge(request.status)}
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
// //                   <div>
// //                     <p className="text-gray-600">Phone</p>
// //                     <p className="font-medium text-gray-900">
// //                       {request.passenger?.phone}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-600">Email</p>
// //                     <p className="font-medium text-gray-900 break-all">
// //                       {request.passenger?.email}
// //                     </p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-600">Applied</p>
// //                     <p className="font-medium text-gray-900">
// //                       {new Date(request.created_at).toLocaleDateString()}
// //                     </p>
// //                   </div>
// //                   {request.verified_at && (
// //                     <div>
// //                       <p className="text-gray-600">Verified</p>
// //                       <p className="font-medium text-gray-900">
// //                         {new Date(request.verified_at).toLocaleDateString()}
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>

// //                 {request.status === 'approved' && request.aadhaar_image_url && (
// //                   <div className="mb-4">
// //                     <p className="text-sm font-medium text-gray-700 mb-2">
// //                       Uploaded Document
// //                     </p>
// //                     <img
// //                       src={request.aadhaar_image_url}
// //                       alt="Aadhaar Document"
// //                       className="max-w-xs h-auto rounded border border-gray-200"
// //                     />
// //                   </div>
// //                 )}

// //                 {request.status === 'pending' && (
// //                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
// //                     <p className="text-sm text-blue-800 mb-4">
// //                       Upload Aadhaar document to approve this application
// //                     </p>
// //                     <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:bg-blue-100 transition">
// //                       <input
// //                         type="file"
// //                         accept="image/*"
// //                         onChange={(e) =>
// //                           handleImageUpload(e, request.id)
// //                         }
// //                         className="hidden"
// //                         disabled={uploadingImage === request.id}
// //                       />
// //                       <div className="flex items-center space-x-2 text-blue-600">
// //                         <Download className="w-5 h-5" />
// //                         <span className="font-medium">
// //                           {uploadingImage === request.id
// //                             ? 'Uploading...'
// //                             : 'Click to upload Aadhaar image'}
// //                         </span>
// //                       </div>
// //                     </label>
// //                   </div>
// //                 )}

// //                 {request.status === 'pending' && (
// //                   <div className="flex space-x-3">
// //                     <button
// //                       onClick={() => setSelectedRequest(request)}
// //                       className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition"
// //                     >
// //                       View Details
// //                     </button>
// //                     <button
// //                       onClick={() => rejectRequest(request.id)}
// //                       className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
// //                     >
// //                       Reject
// //                     </button>
// //                   </div>
// //                 )}

// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }


// // src/components/meeseva/MeesevaDashboard.tsx
// import { useState, useEffect } from "react";
// import {
//   CheckCircle,
//   Clock,
//   XCircle,
//   Download,
//   LogOut,
// } from "lucide-react";
// import { supabase } from "../../lib/supabase";
// import { useAuth } from "../../contexts/AuthContext";

// /* ================= TYPES ================= */

// interface VerificationRequest {
//   id: string;
//   passenger_id: string;
//   aadhaar_number: string;
//   aadhaar_image_url: string | null;
//   status: "pending" | "approved" | "rejected";
//   created_at: string;
//   verified_at: string | null;
//   passenger?: {
//     full_name: string;
//     phone: string | null;
//     email: string;
//   };
// }

// interface MeesevaDashboardProps {
//   onGoHome: () => void;
// }

// /* ================= COMPONENT ================= */

// export function MeesevaDashboard({ onGoHome }: MeesevaDashboardProps) {
//   const [requests, setRequests] = useState<VerificationRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] =
//     useState<"all" | "pending" | "approved" | "rejected">("pending");
//   const [uploadingImage, setUploadingImage] = useState<string | null>(null);

//   const { profile, signOut } = useAuth();

//   /* ================= FETCH DATA ================= */

//   useEffect(() => {
//     fetchVerificationRequests();
//   }, [filter]);

//   const fetchVerificationRequests = async () => {
//     setLoading(true);
//     try {
//       let query = supabase
//         .from("aadhaar_verifications")
//         .select(
//           `
//           id,
//           passenger_id,
//           aadhaar_number,
//           aadhaar_image_url,
//           status,
//           created_at,
//           verified_at,
//           profiles:passenger_id (full_name, phone),
//           auth.users!passenger_id (email)
//         `
//         );

//       if (filter !== "all") {
//         query = query.eq("status", filter);
//       }

//       const { data, error } = await query.order("created_at", {
//         ascending: false,
//       });

//       if (error) throw error;

//       const formatted = (data || []).map((item: any) => ({
//         id: item.id,
//         passenger_id: item.passenger_id,
//         aadhaar_number: item.aadhaar_number,
//         aadhaar_image_url: item.aadhaar_image_url,
//         status: item.status,
//         created_at: item.created_at,
//         verified_at: item.verified_at,
//         passenger: {
//           full_name: item.profiles?.full_name || "Unknown",
//           phone: item.profiles?.phone || "N/A",
//           email: item.auth?.email || "N/A",
//         },
//       }));

//       setRequests(formatted);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ACTIONS ================= */

//   const handleImageUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//     requestId: string
//   ) => {
//     const file = e.target.files?.[0];
//     if (!file || !profile?.id) return;

//     setUploadingImage(requestId);

//     try {
//       const fileName = `aadhaar-${requestId}-${Date.now()}`;

//       const { error: uploadError } = await supabase.storage
//         .from("aadhaar-documents")
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       const { data } = supabase.storage
//         .from("aadhaar-documents")
//         .getPublicUrl(fileName);

//       await supabase
//         .from("aadhaar_verifications")
//         .update({
//           aadhaar_image_url: data.publicUrl,
//           status: "approved",
//           verified_by: profile.id,
//           verified_at: new Date().toISOString(),
//         })
//         .eq("id", requestId);

//       await supabase
//         .from("profiles")
//         .update({ is_verified_woman: true })
//         .eq(
//           "id",
//           requests.find((r) => r.id === requestId)?.passenger_id || ""
//         );

//       fetchVerificationRequests();
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed");
//     } finally {
//       setUploadingImage(null);
//     }
//   };

//   const rejectRequest = async (requestId: string) => {
//     if (!confirm("Reject this request?")) return;

//     await supabase
//       .from("aadhaar_verifications")
//       .update({
//         status: "rejected",
//         verified_by: profile?.id,
//         verified_at: new Date().toISOString(),
//       })
//       .eq("id", requestId);

//     fetchVerificationRequests();
//   };

//   const handleLogout = async () => {
//     await signOut();
//   };

//   /* ================= UI HELPERS ================= */

//   const getStatusBadge = (status: string) => {
//     const map: any = {
//       pending: ["yellow", <Clock className="w-4 h-4" />],
//       approved: ["green", <CheckCircle className="w-4 h-4" />],
//       rejected: ["red", <XCircle className="w-4 h-4" />],
//     };

//     const [color, icon] = map[status];

//     return (
//       <div
//         className={`flex items-center space-x-1 bg-${color}-100 text-${color}-800 px-3 py-1 rounded-full text-sm font-medium`}
//       >
//         {icon}
//         <span>{status}</span>
//       </div>
//     );
//   };

//   /* ================= RENDER ================= */

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ================= NAVBAR ================= */}
//       <nav className="bg-purple-700 shadow-lg">
//         <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">

//           {/* LOGO → HOME */}
//           <button
//             onClick={onGoHome}
//             className="flex items-center space-x-3 hover:opacity-80"
//           >
//             <div className="bg-white p-2 rounded-lg">
//               <CheckCircle className="w-6 h-6 text-purple-700" />
//             </div>
//             <div>
//               <h1 className="text-xl font-bold text-white">Smart Transport</h1>
//               <p className="text-xs text-purple-100">MeeSeva Portal</p>
//             </div>
//           </button>

//           {/* USER + LOGOUT */}
//           <div className="flex items-center space-x-4">
//             <span className="text-white hidden sm:inline">
//               {profile?.full_name}
//             </span>
//             <button
//               onClick={handleLogout}
//               className="flex items-center space-x-2 bg-purple-800 px-4 py-2 rounded-lg text-white hover:bg-purple-900"
//             >
//               <LogOut className="w-4 h-4" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* ================= CONTENT ================= */}
//       <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="bg-white rounded-xl shadow p-6 mb-6">
//           <h2 className="text-2xl font-bold mb-4">
//             Women Aadhaar Verification
//           </h2>

//           <div className="flex space-x-2 overflow-x-auto">
//             {["all", "pending", "approved", "rejected"].map((f) => (
//               <button
//                 key={f}
//                 onClick={() => setFilter(f as any)}
//                 className={`px-6 py-2 rounded-lg font-medium ${
//                   filter === f
//                     ? "bg-purple-600 text-white"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 {f}
//               </button>
//             ))}
//           </div>
//         </div>

//         {loading ? (
//           <p className="text-center">Loading...</p>
//         ) : (
//           <div className="space-y-4">
//             {requests.map((r) => (
//               <div key={r.id} className="bg-white p-6 rounded-xl shadow">
//                 <div className="flex justify-between mb-3">
//                   <div>
//                     <h3 className="font-bold">{r.passenger?.full_name}</h3>
//                     <p className="text-sm text-gray-600">
//                       Aadhaar: {r.aadhaar_number}
//                     </p>
//                   </div>
//                   {getStatusBadge(r.status)}
//                 </div>

//                 {r.status === "pending" && (
//                   <>
//                     <label className="block border-dashed border-2 p-4 rounded-lg cursor-pointer text-center mb-3">
//                       <input
//                         type="file"
//                         hidden
//                         onChange={(e) =>
//                           handleImageUpload(e, r.id)
//                         }
//                       />
//                       <Download className="mx-auto mb-2" />
//                       {uploadingImage === r.id
//                         ? "Uploading..."
//                         : "Upload Aadhaar Image"}
//                     </label>

//                     <button
//                       onClick={() => rejectRequest(r.id)}
//                       className="bg-red-600 text-white px-4 py-2 rounded-lg"
//                     >
//                       Reject
//                     </button>
//                   </>
//                 )}

//                 {r.status === "approved" && r.aadhaar_image_url && (
//                   <img
//                     src={r.aadhaar_image_url}
//                     className="max-w-xs mt-4 border rounded"
//                   />
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// src/components/meeseva/MeesevaDashboard.tsx

import { useState } from "react";
import { CheckCircle, Upload, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";

interface MeesevaDashboardProps {
  onGoHome: () => void;
}

export function MeesevaDashboard({ onGoHome }: MeesevaDashboardProps) {
  const { profile, signOut } = useAuth();

  const [aadhaarNo, setAadhaarNo] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* ================= SUBMIT AADHAAR ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!profile || profile.role !== "meeseva") {
      setError("Unauthorized access");
      return;
    }

    if (!file) {
      setError("Please upload Aadhaar image");
      return;
    }

    try {
      setLoading(true);

      // 🔒 PRIVATE STORAGE PATH
      const filePath = `${aadhaarNo}.jpg`;

      // 1️⃣ Upload Aadhaar image (PRIVATE)
      const { error: uploadError } = await supabase.storage
        .from("aadhaar-documents")
        .upload(filePath, file, { upsert: false });

      if (uploadError) throw uploadError;

      // 2️⃣ Insert Aadhaar record (PERMANENT)
      const { error: insertError } = await supabase
        .from("aadhaar_registry")
        .insert({
          aadhaar_no: aadhaarNo,
          full_name: fullName,
          dob,
          mobile,
          aadhaar_image: filePath,
          verified_by: profile.id,
        });

      if (insertError) throw insertError;

      setSuccess("Aadhaar verified and stored permanently");

      // RESET FORM
      setAadhaarNo("");
      setFullName("");
      setDob("");
      setMobile("");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {
    await signOut();
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= NAVBAR ================= */}
      <nav className="bg-purple-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <button
            onClick={onGoHome}
            className="flex items-center space-x-3 hover:opacity-80"
          >
            <div className="bg-white p-2 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Smart Transport</h1>
              <p className="text-xs text-purple-100">MeeSeva Portal</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-purple-800 px-4 py-2 rounded-lg text-white hover:bg-purple-900"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Women Aadhaar Verification
          </h2>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              value={aadhaarNo}
              onChange={(e) => setAadhaarNo(e.target.value)}
              placeholder="Aadhaar Number (12 digits)"
              maxLength={12}
              pattern="\d{12}"
              required
              className="w-full border p-3 rounded-lg"
            />

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name (as per Aadhaar)"
              required
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full border p-3 rounded-lg"
            />

            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Mobile Number"
              required
              className="w-full border p-3 rounded-lg"
            />

            <label className="block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer">
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <Upload className="mx-auto mb-2" />
              {file ? file.name : "Upload Aadhaar Image"}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
