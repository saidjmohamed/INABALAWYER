import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = AvatarPrimitive.Root;

const AvatarImage = AvatarPrimitive.Image;
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = AvatarPrimitive.Fallback;
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const AvatarFallbackInner = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600", className)}
    {...props}
  />
));
AvatarFallbackInner.displayName = "AvatarFallbackInner";

const AvatarWithFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <Avatar {...props} ref={ref} className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
    {children}
    <AvatarFallbackInner>
      {props.children}
    </AvatarFallbackInner>
  </Avatar>
));
AvatarWithFallback.displayName = "AvatarWithFallback";

export { Avatar, AvatarImage, AvatarFallback, AvatarFallbackInner, AvatarWithFallback };