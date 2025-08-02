import React, { useEffect } from "react";
import "./CustomModal.css"; // Ensure that you have this CSS file for styling

const CustomModal = ({
  isOpen,
  setIsOpen,
  icon,
  title,
  text,
  showConfirmButton = true,
  showCancelButton = true,
  confirmButtonText = "Understood",
  cancelButtonText = "More Information",
  confirmCallback,
  cancelCallback,
}) => {
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (event) => {
        if (event.key === "Escape") {
          setIsOpen(false);
        }
      };
      window.addEventListener("keydown", handleEscape);

      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, setIsOpen]);

  // Ensure that MathJax renders LaTeX content when the modal opens
  useEffect(() => {
    if (isOpen) {
      const contentElement = document.getElementById("modalText");
      if (contentElement) {
        window.MathJax.Hub.Queue([
          "Typeset",
          window.MathJax.Hub,
          contentElement,
        ]);
      }
    }
  }, [isOpen, text]); // Re-render LaTeX when modal opens or text changes

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg modal-container">
        <div className="flex items-center mb-4">
          {icon && (
            <span className={`icon-${icon} mr-2`}>
              {icon === "success" && "✔️"}
              {icon === "info" && "ℹ️"}
              {icon === "error" && "❌"}
            </span>
          )}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        {/* Render the text with HTML content */}
        <div
          id="modalText"
          className="mb-4"
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>

        <div className="flex justify-end gap-2">
          {showCancelButton && (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                if (cancelCallback) cancelCallback();
                setIsOpen(false);
              }}
            >
              {cancelButtonText}
            </button>
          )}
          {showConfirmButton && (
            <button
              className="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => {
                if (confirmCallback) confirmCallback();
                setIsOpen(false);
              }}
            >
              {confirmButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
