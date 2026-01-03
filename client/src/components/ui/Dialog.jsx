import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef(
  ({ children, className = "", showCloseButton = true, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 animate-fade-in" />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FAFBFA] rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-hidden z-50 animate-scale-in border border-gray-200/80 ${className}`}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-2.5 top-2.5 p-1 rounded-md bg-gray-100/80 hover:bg-gray-200 transition-colors group">
            <X className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ children, className = "" }) => (
  <div
    className={`px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-lg ${className}`}
  >
    {children}
  </div>
);

export const DialogTitle = React.forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-sm font-semibold text-gray-800 ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Title>
  )
);

DialogTitle.displayName = "DialogTitle";

export const DialogDescription = React.forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={`text-xs text-gray-500 mt-1 ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  )
);

DialogDescription.displayName = "DialogDescription";

export const DialogBody = ({ children, className = "" }) => (
  <div className={`px-4 py-3 ${className}`}>{children}</div>
);

export const DialogFooter = ({ children, className = "" }) => (
  <div
    className={`px-4 py-2.5 border-t border-gray-100 flex justify-end gap-2 bg-gray-50/30 rounded-b-lg ${className}`}
  >
    {children}
  </div>
);

export const DialogClose = DialogPrimitive.Close;

export default Dialog;
