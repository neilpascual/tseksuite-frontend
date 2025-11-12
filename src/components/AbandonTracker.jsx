import { useEffect, useRef } from "react";

function AbandonTracker({ children, examiner_id = 1, quiz_id = 1 }) {
  const timerRef = useRef(null);

  useEffect(() => {

    goFullScreen()
    // Function to mark as abandoned
    const handleAbandon = () => {
      if (!examiner_id) return;

      const abandonData = {
        examiner_id,
        quiz_id,
        status: "ABANDONED",
        created_at: Date.now(),
      };

      console.log("💀 Abandon detected:", abandonData);

      // Save locally for deferred sending
      localStorage.setItem("pendingAbandon", JSON.stringify(abandonData));

      // Try sending immediately via sendBeacon (best effort)
      const blob = new Blob([JSON.stringify(abandonData)], {
        type: "application/json",
      });
      navigator.sendBeacon(`${import.meta.env.VITE_API_BASE_URL}/result/create`, blob);
    };

    // Detect tab switch / inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Show message immediately
        alert("⚠️ You left the test tab. If you stay out for a few seconds, your test will be abandoned!");

        // Start abandon timer (e.g., 10s)
        timerRef.current = setTimeout(handleAbandon, 10000);
      } else {
        clearTimeout(timerRef.current);
      }
    };

    // Detect reload / close
    const handleBeforeUnload = () => handleAbandon();

    // Attach listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      clearTimeout(timerRef.current);
    };
  }, [examiner_id, quiz_id]);

  // On mount, check if there was a pending abandon
  useEffect(() => {
    const pending = localStorage.getItem("pendingAbandon");
    if (pending) {
      const data = JSON.parse(pending);
      alert(
        "💀 Pending abandon detected from last session:\n" +
          JSON.stringify(data, null, 2)
      );
      console.log("Recovered pending abandon:", data);

      // Remove flag after processing
      localStorage.removeItem("pendingAbandon");
    }
  }, []);

  function goFullScreen() {
  const elem = document.documentElement; // whole page
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

  return <>{children}</>;
}

export default AbandonTracker;
