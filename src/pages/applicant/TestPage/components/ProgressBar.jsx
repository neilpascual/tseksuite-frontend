const ProgressBar = ({ percentage }) => (
  <div
    className="sticky top-0 h-1.5 bg-[#2E99B0] transition-all duration-300 ease-out z-50"
    style={{ width: `${percentage}%` }}
  />
);

export default ProgressBar;