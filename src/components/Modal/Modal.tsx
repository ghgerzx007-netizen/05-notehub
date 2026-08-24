import { createPortal } from "react-dom";
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
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
  if (!children) {
    return null;
  }

  const portalRoot = document.getElementById("modal-root");
  if (!portalRoot) return null;
  return createPortal(
    <div
      onClick={onClose}
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
    >
      <div onClick={(e) => e.stopPropagation()} className={css.modal}>
        {children}
      </div>
    </div>,
    portalRoot,
  );
}
export default Modal;
