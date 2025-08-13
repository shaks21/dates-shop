"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "./ui/ConfirmDialog";

type RemoveButtonWithConfirmProps = {
  itemTitle: string;
  onConfirmRemove: () => void;
  className?: string;
  ariaLabel?: string;
  title?: string;
};

export default function RemoveButtonWithConfirm({
  itemTitle,
  onConfirmRemove,
  className = "",
  ariaLabel,
  title,
}: RemoveButtonWithConfirmProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setConfirmOpen(true)}
        className={`pt-1 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all duration-200 focus:outline-none ${className}`}
        aria-label={ariaLabel ?? `Remove ${itemTitle} from cart`}
        title={title ?? `Remove ${itemTitle}`}
        type="button"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => {
          onConfirmRemove();
          setConfirmOpen(false);
        }}
        title="Remove Item"
        description={`Are you sure you want to remove "${itemTitle}" from your cart?`}
      />
    </>
  );
}
