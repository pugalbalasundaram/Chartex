"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

import { cn } from "@/lib/utils";

const AlertDialog = AlertDialogPrimitive.Root;

function AlertDialogTrigger({
  asChild = false,
  children,
  ...props
}: AlertDialogPrimitive.Trigger.Props & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return <AlertDialogPrimitive.Trigger render={children} {...props} />;
  }

  return <AlertDialogPrimitive.Trigger {...props}>{children}</AlertDialogPrimitive.Trigger>;
}

function AlertDialogContent({ className, ...props }: AlertDialogPrimitive.Popup.Props) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50" />
      <AlertDialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <AlertDialogPrimitive.Popup
          className={cn("w-full max-w-md rounded-xl border border-border bg-popover p-6 text-popover-foreground shadow-lg", className)}
          {...props}
        />
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-2 text-left", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return <AlertDialogPrimitive.Title className={cn("text-lg font-semibold", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return <AlertDialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function AlertDialogCancel({ className, ...props }: AlertDialogPrimitive.Close.Props) {
  return <AlertDialogPrimitive.Close className={cn("inline-flex h-8 items-center justify-center rounded-lg border border-input px-3 text-sm font-medium hover:bg-muted", className)} {...props} />;
}

function AlertDialogAction({ className, ...props }: AlertDialogPrimitive.Close.Props) {
  return <AlertDialogPrimitive.Close className={cn("inline-flex h-8 items-center justify-center rounded-lg bg-destructive px-3 text-sm font-medium text-white hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50", className)} {...props} />;
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
