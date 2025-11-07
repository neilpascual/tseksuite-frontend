// const SidebarHeader = () => (
//   <div className="px-3">
//     <div className="w-full flex items-center gap-3 sm:bg-[#2E99B0] rounded-full sm:rounded-3xl sm:px-3 sm:py-6">
//       <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
//         <img
//           src="/assets/sampleImage.png"
//           alt="Avatar"
//           className="w-full h-full object-cover rounded-full"
//         />
//       </div>
//       <div className="hidden sm:flex flex-col gap-1">
//         <div className="text-white text-sm font-semibold">Neil Pascual</div>
//         <div className="h-px w-full bg-white opacity-30" />
//         <div className="text-white text-xs font-light">Software Engineer</div>
//       </div>
//     </div>
//   </div>
// );
//

const SidebarHeader = ({ size = 64 }) => {
  const sizeClass = `w-[${size}px] h-[${size}px]`;

  return (
    <div className="w-full flex items-center gap-3 sm:bg-[#2E99B0] rounded-full sm:rounded-3xl sm:px-3 sm:py-6">
      <div className={`rounded-full overflow-hidden ${sizeClass}`}>
        <img
          src="/assets/sampleImage.png"
          alt="Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="hidden sm:flex flex-col gap-1">
        <div className="text-white text-sm font-semibold">Neil Pascual</div>
        <div className="h-px w-full bg-white opacity-30" />
        <div className="text-white text-xs font-light">Software Engineer</div>
      </div>
    </div>
  );
};
export default SidebarHeader;
