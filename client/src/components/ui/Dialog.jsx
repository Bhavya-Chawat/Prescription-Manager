import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export const DialogContent = React.forwardRef(
  ({ children, className = "", showCloseButton = true, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in" />
      <DialogPrimitive.Content
        ref={ref}
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-full max-w-2xl z-50 animate-scale-in border border-gray-200 ${className}`}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-4 top-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors group">
            <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
);

DialogContent.displayName = "DialogContent";

export const DialogHeader = ({ children, className = "" }) => (
  <div
    className={`px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl ${className}`}
  >
    {children}
  </div>
);

export const DialogTitle = React.forwardRef(
  ({ children, className = "", ...props }, ref) => (
    <DialogPrimitive.Title
      ref={ref}
      className={`text-xl font-semibold text-gray-900 ${className}`}
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
      className={`text-sm text-gray-500 mt-1.5 ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Description>
  )
);

DialogDescription.displayName = "DialogDescription";

export const DialogBody = ({ children, className = "" }) => (
  <div className={`px-6 py-5 ${className}`}>{children}</div>
);

export const DialogFooter = ({ children, className = "" }) => (
  <div
    className={`px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50 rounded-b-2xl ${className}`}
  >
    {children}
  </div>
);

export const DialogClose = DialogPrimitive.Close;

export default Dialog;
