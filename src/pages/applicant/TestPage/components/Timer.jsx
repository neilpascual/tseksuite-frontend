import ClockIcon from "../../../../assets/clock.svg";

const Timer = ({ timeRemaining }) => (
  <div
    className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-lg transition-colors duration-200"
    style={{ boxShadow: "2px 2px 0px 0px rgba(0, 0, 0, 1)" }}
  >
    <img src={ClockIcon} className="w-5 h-5" alt="clock" />
    <span className="font-semibold text-gray-900 text-lg">
      {timeRemaining}
    </span>
  </div>
);

export default Timer;