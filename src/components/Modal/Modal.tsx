import css from "./Modal.module.css";
import { useEffect } from "react";

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);
  if (!children) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()} className={css.modal}>
        {children}
      </div>
    </div>
  );
}

export default Modal;
