import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type MobileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  position?: "center" | "bottom";
  footer?: React.ReactNode;
  preventOutsideClick?: boolean;
};

const MobileModal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  position = "center",
  footer,
  preventOutsideClick = false,
}: MobileModalProps) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50" 
        onClose={preventOutsideClick ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className={cn(
            "flex min-h-full items-center justify-center p-4 text-center",
            position === "bottom" && "items-end"
          )}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom={position === "bottom" ? "opacity-0 translate-y-full" : "opacity-0 scale-95"}
              enterTo={position === "bottom" ? "opacity-100 translate-y-0" : "opacity-100 scale-100"}
              leave="ease-in duration-200"
              leaveFrom={position === "bottom" ? "opacity-100 translate-y-0" : "opacity-100 scale-100"}
              leaveTo={position === "bottom" ? "opacity-0 translate-y-full" : "opacity-0 scale-95"}
            >
              <Dialog.Panel className={cn(
                "w-full max-w-md transform overflow-hidden rounded-2xl bg-white bg-[#1e293b] p-6 text-left align-middle shadow-xl transition-all",
                position === "bottom" && "rounded-b-none",
                className
              )}>
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-[#0f172a] text-white mb-4 pr-6"
                  >
                    {title}
                  </Dialog.Title>
                )}

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-1 hover:bg-[#f1f5f9] hover:bg-[#334155] transition-colors"
                  >
                    <X className="h-5 w-5 text-[#64748b] text-[#94a3b8]" />
                  </button>
                )}

                <div className={cn(footer ? "mb-6" : "")}>
                  {children}
                </div>

                {footer && (
                  <div className="mt-4 flex justify-end space-x-3">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// 모달을 위한 표준 확인/취소 버튼
const ModalActions = ({
  onConfirm,
  onCancel,
  confirmText = "확인",
  cancelText = "취소",
  confirmVariant = "default",
  isLoading = false,
  disabled = false
}: {
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "default" | "destructive" | "outline";
  isLoading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <>
      <Button
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="text-sm h-9"
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        disabled={disabled || isLoading}
        className="text-sm h-9"
      >
        {confirmText}
      </Button>
    </>
  );
};

export { MobileModal, ModalActions }; 