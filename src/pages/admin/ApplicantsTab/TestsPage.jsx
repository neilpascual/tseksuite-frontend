import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import {
 getAllExaminers,
 deleteExamineeAttempt
} from "../../../../api/api";
import {
 Search,
 Filter,
 Download,
 X,
 FileText,
 Calendar,
 Trash2,
 ChevronDown,
 ChevronUp,
 User,
 Clock,
 MoreVertical,
 Loader,
 AlertCircle,
} from "lucide-react";
import ConfirmationModal from "@/components/ConfimationModal";


function useMediaQuery(query) {
 const [matches, setMatches] = useState(false);


 useEffect(() => {
   const media = window.matchMedia(query);
   if (media.matches !== matches) setMatches(media.matches);
   const listener = () => setMatches(media.matches);
   media.addListener(listener);
   return () => media.removeListener(listener);
 }, [matches, query]);


 return matches;
}


function TestsPage() {
 const isMobile = useMediaQuery("(max-width: 768px)");
 const isTablet = useMediaQuery("(max-width: 1024px)");
 const [rawData, setRawData] = useState([]);
 const [filteredRawData, setFilteredRawData] = useState([]);
 const [isDataLoading, setIsDataLoading] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [showFilters, setShowFilters] = useState(false);
 const [currentPage, setCurrentPage] = useState(1);
 const [rowsPerPage, setRowsPerPage] = useState(10);
 const [showModal, setShowModal] = useState(false);
 const [modalPayload, setModalPayload] = useState(null);
 const [expandedGroups, setExpandedGroups] = useState(new Set());
 const [activeDropdown, setActiveDropdown] = useState(null);
 const [filters, setFilters] = useState({
   department: "",
   dateFrom: "",
   dateTo: "",
 });


 const fetchAllExaminers = async () => {
   try {
     setIsDataLoading(true);
     const res = await getAllExaminers();
     setRawData(Array.isArray(res) ? res : []);
     setFilteredRawData(Array.isArray(res) ? res : []);
   } catch (error) {
     console.error(error);
     toast.error("Failed to fetch examiners");
   } finally {
     setIsDataLoading(false);
   }
 };


 useEffect(() => {
   fetchAllExaminers();
 }, []);


 const groupedByExaminee = useMemo(() => {
   const map = new Map();


   filteredRawData.forEach((row) => {
     const email = row.email?.toString().trim() || null;
     const name = row.examiner_name || row.name || "Unknown Examiner";
     const department = row.department || "No Department";


     const attemptId =
       row.attempt_id ||
       row.attemptId ||
       row.attempt ||
       row.id ||
       `${row.date || "unknown"}|${row.time || "unknown"}`;


     const key = email || name || String(attemptId);


     if (!map.has(key)) {
       map.set(key, {
         key,
         email,
         name,
         department,
         attempts: [],
       });
     }


     map.get(key).attempts.push({
       attemptId,
       date: row.date || new Date(row.created_at || row.createdAt).toLocaleDateString(),
       time: row.time || (row.created_at ? new Date(row.created_at).toLocaleTimeString() : ""),
       raw: row,
     });
   });


   const groups = Array.from(map.values()).map((g) => {
     g.attempts.sort((a, b) => {
       const aDt = new Date(a.raw?.created_at || a.raw?.createdAt || `${a.date} ${a.time}`);
       const bDt = new Date(b.raw?.created_at || b.raw?.createdAt || `${b.date} ${b.time}`);
       return bDt - aDt;
     });
     return g;
   });


   groups.sort((a, b) => (a.name || "").localeCompare(b.name || ""));


   return groups;
 }, [filteredRawData]);


 const applyFilters = (newFilters = filters, searchTerm = searchQuery) => {
   let filtered = [...rawData];


   if (searchTerm) {
     const q = searchTerm.toLowerCase();
     filtered = filtered.filter((row) =>
       [
         row.examiner_name,
         row.name,
         row.email,
         row.department,
         row.date,
         row.time,
         row.created_at,
       ]
         .filter(Boolean)
         .some((v) => v.toString().toLowerCase().includes(q))
     );
   }


   if (newFilters.department) {
     filtered = filtered.filter((row) => row.department === newFilters.department);
   }


   if (newFilters.dateFrom) {
     const from = new Date(newFilters.dateFrom);
     from.setHours(0, 0, 0, 0);
     filtered = filtered.filter((row) => {
       const val = row.created_at || row.date;
       if (!val) return false;
       const d = new Date(val);
       return d >= from;
     });
   }


   if (newFilters.dateTo) {
     const to = new Date(newFilters.dateTo);
     to.setHours(23, 59, 59, 999);
     filtered = filtered.filter((row) => {
       const val = row.created_at || row.date;
       if (!val) return false;
       const d = new Date(val);
       return d <= to;
     });
   }


   setFilteredRawData(filtered);
   setCurrentPage(1);
 };


 const handleSearch = (q) => {
   setSearchQuery(q);
   applyFilters(filters, q);
 };


 const handleFilterChange = (key, value) => {
   const newFilters = { ...filters, [key]: value };
   setFilters(newFilters);
   applyFilters(newFilters, searchQuery);
 };


 const clearFilters = () => {
   const cleared = { department: "", dateFrom: "", dateTo: "" };
   setFilters(cleared);
   setSearchQuery("");
   setFilteredRawData(rawData);
   setCurrentPage(1);
   setExpandedGroups(new Set());
   setShowFilters(false);
 };


 const toggleGroupExpansion = (groupKey) => {
   const newExpanded = new Set(expandedGroups);
   if (newExpanded.has(groupKey)) {
     newExpanded.delete(groupKey);
   } else {
     newExpanded.add(groupKey);
   }
   setExpandedGroups(newExpanded);
 };


 const exportAllVisibleAttempts = () => {
   const rows = filteredRawData;
   if (rows.length === 0) {
     toast.error("No data to export");
     return;
   }
   const headers = ["Examiner", "Email", "Department", "Date", "Time", "AttemptId"];
   const csvContent = [
     headers.join(","),
     ...rows.map((r) =>
       [
         `"${r.examiner_name || r.name || ""}"`,
         r.email || "",
         r.department || "",
         r.date || r.created_at || "",
         r.time || "",
         (r.attempt_id || r.attemptId || r.id || "").toString(),
       ].join(",")
     ),
   ].join("\n");


   const blob = new Blob([csvContent], { type: "text/csv" });
   const url = window.URL.createObjectURL(blob);
   const a = document.createElement("a");
   a.href = url;
   a.download = `examiners_${new Date().toISOString().split("T")[0]}.csv`;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
   window.URL.revokeObjectURL(url);
   toast.success("Exported CSV successfully");
 };


 const deleteAttempt = async ({ attemptId, email, name }) => {
   setModalPayload({ type: "attempt", attemptId, email, name });
   setShowModal(true);
   setActiveDropdown(null);
 };


 const deleteAllAttempts = async ({ email, name }) => {
   setModalPayload({ type: "all", email, name });
   setShowModal(true);
   setActiveDropdown(null);
 };


 const onConfirmDelete = async () => {
   try {
     if (!modalPayload) return;
     setShowModal(false);


     if (modalPayload.type === "attempt") {
       const { attemptId } = modalPayload;

       await deleteExamineeAttempt(attemptId);

       setRawData((prev) => prev.filter((r) => {
         const candidateId = r.attempt_id || r.attemptId || r.attempt || r.id || `${r.date}|${r.time}`;
         return String(candidateId) !== String(attemptId);
       }));


       setFilteredRawData((prev) => prev.filter((r) => {
         const candidateId = r.attempt_id || r.attemptId || r.attempt || r.id || `${r.date}|${r.time}`;
         return String(candidateId) !== String(attemptId);
       }));


       toast.success("Attempt deleted successfully");
     } 


     setModalPayload(null);
   } catch (err) {
     console.error(err);
     toast.error("Failed to delete. Please try again.");
     setModalPayload(null);
   }
 };


 const onCancelDelete = () => {
   setModalPayload(null);
   setShowModal(false);
 };


 const totalGroups = groupedByExaminee.length;
 const indexOfLastRow = currentPage * rowsPerPage;
 const indexOfFirstRow = indexOfLastRow - rowsPerPage;
 const currentGroups = groupedByExaminee.slice(indexOfFirstRow, indexOfLastRow);
 const totalPages = Math.max(1, Math.ceil(totalGroups / rowsPerPage));


 const handlePageChange = (newPage) => {
   if (newPage < 1 || newPage > totalPages) return;
   setCurrentPage(newPage);
   // Scroll to top when page changes
   window.scrollTo({ top: 0, behavior: 'smooth' });
 };


 const handleRowsPerPageChange = (e) => {
   setRowsPerPage(Number(e.target.value));
   setCurrentPage(1);
 };


 const uniqueDepartments = [
   ...new Set(
     rawData.map((item) => item.department).filter((dept) => dept && dept !== "N/A")
   ),
 ];
 const activeFilterCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);


 // Close dropdown when clicking outside
 useEffect(() => {
   const handleClickOutside = () => setActiveDropdown(null);
   document.addEventListener('click', handleClickOutside);
   return () => document.removeEventListener('click', handleClickOutside);
 }, []);


 const MobileCard = ({ group }) => {
   const isExpanded = expandedGroups.has(group.key);
  
   return (
     <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
       {/* Header */}
       <div className="flex items-start justify-between mb-3">
         <div className="flex items-center gap-3 flex-1 min-w-0">
           <div className="relative fshrink-0">
             <div className="w-10 h-10 bg-linear-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
               {group.name?.charAt(0)?.toUpperCase() || "E"}
             </div>
           </div>
          
           <div className="flex-1 min-w-0">
             <p className="text-sm font-semibold text-gray-900 truncate mb-1">
               {group.name}
             </p>
             {group.email && (
               <p className="text-xs text-gray-600 truncate mb-2">
                 {group.email}
               </p>
             )}
             <div className="flex items-center gap-1">
               <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                 <FileText className="w-3 h-3" />
                 {group.department}
               </span>
             </div>
           </div>
         </div>
       </div>


       {/* Stats */}
       <div className="flex items-center justify-between mb-3">
         <div className="flex items-center gap-4 text-xs text-gray-600">
           <span className="flex items-center gap-1">
             <Calendar className="w-3 h-3 text-cyan-600" />
             {group.attempts.length} attempt{group.attempts.length !== 1 ? 's' : ''}
           </span>
           {group.attempts[0] && (
             <span className="text-gray-500">
               Latest: {group.attempts[0].date}
             </span>
           )}
         </div>
       </div>


       {/* Actions */}
       <div className="flex items-center justify-between gap-2">
         <button
           onClick={(e) => {
             e.stopPropagation();
             toggleGroupExpansion(group.key);
           }}
           className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors flex-1 justify-center"
         >
           {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
           {isExpanded ? "Hide" : "View"} Details
         </button>
        
         <div className="relative">
           <button
             onClick={(e) => {
               e.stopPropagation();
               setActiveDropdown(activeDropdown === group.key ? null : group.key);
             }}
             className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
           >
             <MoreVertical className="w-4 h-4" />
           </button>
           
           {activeDropdown === group.key && (
             <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
               <button
                 onClick={() => deleteAllAttempts({ email: group.email, name: group.name })}
                 className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
               >
                 <Trash2 className="w-4 h-4" />
                 Delete All Attempts
               </button>
             </div>
           )}
         </div>
       </div>


       {/* Expanded Attempts */}
       {isExpanded && (
         <div className="mt-4 pt-4 border-t border-gray-100">
           <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">Attempt Details</h4>
           <div className="space-y-2">
             {group.attempts.map((attempt, index) => (
               <div
                 key={attempt.attemptId}
                 className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
               >
                 <div className="flex items-center gap-3 flex-1 min-w-0">
                   <div className="w-6 h-6 bg-cyan-100 text-cyan-700 rounded flex items-center justify-center text-xs font-semibold shrink-0">
                     #{index + 1}
                   </div>
                   <div className="min-w-0 flex-1">
                     <div className="text-sm font-medium text-gray-900">{attempt.date}</div>
                     <div className="text-xs text-gray-500 font-mono truncate">{attempt.time}</div>
                   </div>
                 </div>
                
                 <button
                   onClick={() => deleteAttempt({
                     attemptId: attempt.attemptId,
                     email: group.email,
                     name: group.name
                   })}
                   className="flex items-center gap-1 px-2 py-1.5 bg-red-50 text-red-700 rounded text-xs font-medium hover:bg-red-100 transition-colors shrink-0 ml-2"
                 >
                   <Trash2 className="w-3 h-3" />
                   Delete
                 </button>
               </div>
             ))}
           </div>
         </div>
       )}
     </div>
   );
 };


 const TabletCard = ({ group }) => {
   const isExpanded = expandedGroups.has(group.key);
   const visibleAttempts = isExpanded ? group.attempts : group.attempts.slice(0, 3);
  
   return (
     <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300">
       {/* Header */}
       <div className="flex items-start justify-between mb-4">
         <div className="flex items-center gap-3 flex-1 min-w-0">
           <div className="relative shrink-0">
             <div className="w-12 h-12 bg-linear-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
               {group.name?.charAt(0)?.toUpperCase() || "E"}
             </div>
           </div>
          
           <div className="flex-1 min-w-0">
             <p className="text-base font-semibold text-gray-900 mb-1">{group.name}</p>
             {group.email && (
               <p className="text-sm text-gray-600 truncate mb-2">{group.email}</p>
             )}
             <div className="flex items-center gap-2 flex-wrap">
               <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                 <FileText className="w-3 h-3" />
                 {group.department}
               </span>
               <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                 {group.attempts.length} attempts
               </span>
             </div>
           </div>
         </div>
       </div>


       {/* Actions */}
       <div className="flex items-center justify-between mb-4">
         <button
           onClick={() => toggleGroupExpansion(group.key)}
           className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
         >
           {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
           {isExpanded ? "Show Less" : `Show All (${group.attempts.length})`}
         </button>
       </div>


       {/* Attempts List */}
       <div className="space-y-2">
         {visibleAttempts.map((attempt, index) => (
           <div
             key={attempt.attemptId}
             className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
           >
             <div className="flex items-center gap-3 flex-1 min-w-0">
               <div className="w-6 h-6 bg-cyan-100 text-cyan-700 rounded flex items-center justify-center text-xs font-semibold shrink-0">
                 #{index + 1}
               </div>
               <div className="flex items-center gap-4 min-w-0 flex-1">
                 <div className="text-sm font-medium text-gray-900">{attempt.date}</div>
                 <div className="text-xs text-gray-500 font-mono">{attempt.time}</div>
               </div>
             </div>
            
             <button
               onClick={() => deleteAttempt({
                 attemptId: attempt.attemptId,
                 email: group.email,
                 name: group.name
               })}
               className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-700 rounded text-sm font-medium hover:bg-red-100 transition-colors shrink-0 ml-2"
             >
               <Trash2 className="w-4 h-4" />
               Delete
             </button>
           </div>
         ))}
       </div>
     </div>
   );
 };


 const DesktopRow = ({ group }) => {
   const isExpanded = expandedGroups.has(group.key);
  
   return (
     <>
       <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
         <td className="px-4 py-4">
           <div className="flex items-center gap-3">
             <div className="relative shrink-0">
               <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                 {group.name?.charAt(0)?.toUpperCase() || "E"}
               </div>
               {/* {group.attempts.length > 0 && (
                 <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm">
                   {group.attempts.length}
                 </div>
               )} */}
             </div>
             <div className="min-w-0 flex-1">
               <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                 {group.name}
               </p>
               {group.email && (
                 <p className="text-xs text-gray-600 truncate mb-2 flex items-center gap-1">
                   <User className="w-3 h-3" />
                   {group.email}
                 </p>
               )}
               <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                 <FileText className="w-3 h-3" />
                 {group.department}
               </span>
             </div>
           </div>
         </td>
        
         <td className="px-4 py-4">
           <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2 text-sm text-gray-700">
               <Calendar className="w-4 h-4 text-cyan-600" />
               <span className="font-medium">
                 {group.attempts.length} attempt{group.attempts.length !== 1 ? 's' : ''}
               </span>
             </div>
             {group.attempts[0] && (
               <div className="text-xs text-gray-500 pl-6">
                 Latest: {group.attempts[0].date}
               </div>
             )}
           </div>
         </td>
        
         <td className="px-4 py-4">
           <button
             onClick={() => toggleGroupExpansion(group.key)}
             className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
           >
             {isExpanded ? (
               <>
                 <ChevronUp className="w-4 h-4" />
                 Hide Details
               </>
             ) : (
               <>
                 <ChevronDown className="w-4 h-4" />
                 View Details
               </>
             )}
           </button>
         </td>
       </tr>


       {/* Expanded Attempts Section */}
       {isExpanded && (
         <tr className="bg-blue-50/30">
           <td colSpan="4" className="px-4 py-4">
             <div className="pl-12 pr-4">
               <div className="bg-white rounded-lg border border-gray-200 p-4">
                 <div className="flex items-center justify-between mb-3">
                   <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                     Examination Attempts
                   </h4>
                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                     {group.attempts.length} total attempts
                   </span>
                 </div>
                
                 <div className="grid gap-2">
                   {group.attempts.map((attempt, index) => (
                     <div
                       key={attempt.attemptId}
                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-200 transition-colors duration-200"
                     >
                       <div className="flex items-center gap-3 flex-1">
                         <div className="flex items-center justify-center w-6 h-6 bg-cyan-100 text-cyan-700 rounded font-semibold text-xs">
                           #{index + 1}
                         </div>
                        
                         <div className="flex items-center gap-4">
                           <div className="flex items-center gap-2 text-sm text-gray-700">
                             <Calendar className="w-4 h-4 text-cyan-600" />
                             <span className="font-medium">{attempt.date}</span>
                           </div>
                           <div className="flex items-center gap-2 text-sm text-gray-700">
                             <Clock className="w-4 h-4 text-blue-600" />
                             <span className="font-mono">{attempt.time}</span>
                           </div>
                         </div>
                          
                         <div className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded ml-4">
                           ID: {attempt.attemptId}
                         </div>
                       </div>
                      
                       <button
                         onClick={() => deleteAttempt({
                           attemptId: attempt.attemptId,
                           email: group.email,
                           name: group.name
                         })}
                         className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded text-sm font-medium hover:bg-red-100 transition-colors duration-200"
                       >
                         <Trash2 className="w-4 h-4" />
                         Delete
                       </button>
                     </div>
                   ))}
                 </div>
                
                 {group.attempts.length === 0 && (
                   <div className="text-center py-6 text-gray-500">
                     <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                     <p className="text-sm">No examination attempts found</p>
                   </div>
                 )}
               </div>
             </div>
           </td>
         </tr>
       )}
     </>
   );
 };


 return (
   <>
     {showModal && modalPayload && (
       <ConfirmationModal
         title={modalPayload.type === "attempt" ? "Delete attempt?" : "Delete all attempts?"}
         message={
           modalPayload.type === "attempt"
             ? `Delete this attempt by ${modalPayload.name || modalPayload.email}? This action cannot be undone.`
             : `Delete ALL attempts for ${modalPayload.name || modalPayload.email}? This action cannot be undone and will permanently remove all examination data for this user.`
         }
         confirmLabel="Delete"
         cancelLabel="Cancel"
         onClose={onCancelDelete}
         onConfirm={onConfirmDelete}
         confirmColor="red"
       />
     )}


     <div className="min-h-screen  px-4 sm:px-6 lg:px-8 py-6">
       <div className="max-w-7xl mx-auto">
         {/* Header */}
         <div className="mb-6 sm:mb-8">
           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div>
               <h1 className="text-2xl sm:text-3xl font-light text-cyan-900 mb-2">Examinees</h1>
               <p className="text-gray-600 text-sm">
                 Total examinees: <span className="font-semibold">{groupedByExaminee.length}</span> • 
                 Total attempts: <span className="font-semibold">{rawData.length}</span>
               </p>
             </div>
             
             <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">
               <Loader className="w-4 h-4 text-cyan-600" />
               <span>Last updated: {new Date().toLocaleTimeString()}</span>
             </div>
           </div>
         </div>


         {/* Controls */}
         <div className="mb-6">
           <div className="flex flex-col lg:flex-row gap-4">
             {/* Search */}
             <div className="flex-1 relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <input
                 type="text"
                 placeholder="Search by name, email, department..."
                 value={searchQuery}
                 onChange={(e) => handleSearch(e.target.value)}
                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
               />
             </div>


             {/* Action Buttons */}
             <div className="flex gap-3">
               <button
                 onClick={() => setShowFilters(!showFilters)}
                 className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                   showFilters || activeFilterCount > 0 
                     ? "bg-cyan-600 text-white shadow-sm" 
                     : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                 }`}
               >
                 <Filter className="w-4 h-4" />
                 Filters
                 {activeFilterCount > 0 && (
                   <span className="bg-white text-cyan-600 text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                     {activeFilterCount}
                   </span>
                 )}
               </button>


               <button
                 onClick={exportAllVisibleAttempts}
                 disabled={filteredRawData.length === 0}
                 className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 <Download className="w-4 h-4" />
                 Export CSV
               </button>
             </div>
           </div>


           {/* Filters Panel */}
           {showFilters && (
             <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
               <div className="flex items-center justify-between mb-3">
                 <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
                 {activeFilterCount > 0 && (
                   <button 
                     onClick={clearFilters}
                     className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
                   >
                     Clear all
                   </button>
                 )}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
                   <select
                     value={filters.department}
                     onChange={(e) => handleFilterChange("department", e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
                   >
                     <option value="">All Departments</option>
                     {uniqueDepartments.map((dept) => (
                       <option key={dept} value={dept}>{dept}</option>
                     ))}
                   </select>
                 </div>


                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
                   <input 
                     type="date" 
                     value={filters.dateFrom} 
                     onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                   />
                 </div>
                 
                 <div>
                   <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
                   <input 
                     type="date" 
                     value={filters.dateTo} 
                     onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                   />
                 </div>
                 
                 <div className="flex items-end">
                   {activeFilterCount > 0 && (
                     <button 
                       onClick={clearFilters}
                       className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors w-full justify-center"
                     >
                       <X className="w-4 h-4" />
                       Clear Filters
                     </button>
                   )}
                 </div>
               </div>
             </div>
           )}
         </div>


         {/* Content */}
         {isDataLoading ? (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
             <div className="w-8 h-8 border-3 border-cyan-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-gray-600 text-sm">Loading examiners data...</p>
           </div>
         ) : groupedByExaminee.length === 0 ? (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 flex flex-col items-center justify-center text-center">
             <div className="bg-gray-100 p-3 rounded-full mb-4">
               <AlertCircle className="w-8 h-8 text-gray-400" />
             </div>
             <p className="text-gray-900 font-semibold text-lg mb-2">No Examinees Found</p>
             <p className="text-gray-600 text-sm max-w-md mb-4">
               {searchQuery || activeFilterCount > 0 
                 ? "No results match your search criteria. Try adjusting your filters or search term." 
                 : "There are no examinees available at the moment."}
             </p>
             {(searchQuery || activeFilterCount > 0) && (
               <button 
                 onClick={clearFilters}
                 className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
               >
                 Clear Search & Filters
               </button>
             )}
           </div>
         ) : (
           <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {isMobile ? (
               <div className="p-4">
                 {currentGroups.map((g) => (
                   <MobileCard key={g.key} group={g} />
                 ))}
               </div>
             ) : isTablet ? (
               <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {currentGroups.map((g) => (
                   <TabletCard key={g.key} group={g} />
                 ))}
               </div>
             ) : (
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                     <tr className="bg-gray-50 border-b border-gray-200">
                       <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                         Examinee
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                         Activity
                       </th>
                       <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                         Details
                       </th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                     {currentGroups.map((g) => (
                       <DesktopRow key={g.key} group={g} />
                     ))}
                   </tbody>
                 </table>
               </div>
             )}


             {/* Pagination */}
             <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                 <div className="flex items-center gap-4 text-sm">
                   <p className="text-gray-700">
                     Showing <span className="font-semibold">{Math.min(indexOfFirstRow + 1, totalGroups)}</span> to{" "}
                     <span className="font-semibold">{Math.min(indexOfLastRow, totalGroups)}</span> of{" "}
                     <span className="font-semibold">{totalGroups}</span> examinees
                   </p>
                   <select 
                     value={rowsPerPage} 
                     onChange={handleRowsPerPageChange}
                     className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                   >
                     <option value={5}>5 per page</option>
                     <option value={10}>10 per page</option>
                     <option value={25}>25 per page</option>
                     <option value={50}>50 per page</option>
                   </select>
                 </div>


                 <div className="flex items-center gap-1">
                   <button 
                     onClick={() => handlePageChange(currentPage - 1)} 
                     disabled={currentPage === 1}
                     className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     Previous
                   </button>


                   <div className="flex gap-1">
                     {[...Array(totalPages)].map((_, i) => {
                       const pageNumber = i + 1;
                       if (
                         pageNumber === 1 ||
                         pageNumber === totalPages ||
                         (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                       ) {
                         return (
                           <button
                             key={pageNumber}
                             onClick={() => handlePageChange(pageNumber)}
                             className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                               currentPage === pageNumber
                                 ? "bg-cyan-600 text-white"
                                 : "text-gray-700 hover:bg-gray-100"
                             }`}
                           >
                             {pageNumber}
                           </button>
                         );
                       } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                         return (
                           <span key={pageNumber} className="px-2 py-1.5 text-gray-400 text-sm">
                             ...
                           </span>
                         );
                       }
                       return null;
                     })}
                   </div>
                   <button 
                     onClick={() => handlePageChange(currentPage + 1)} 
                     disabled={currentPage === totalPages}
                     className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                   >
                     Next
                   </button>
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   </>
 );
}


export default TestsPage;