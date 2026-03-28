"use client";

import { CircleCheck } from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ icons, ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      icons={{
        success: (
          <CircleCheck
            className="size-4 shrink-0 text-green-600 dark:text-green-400"
            aria-hidden
          />
        ),
        ...icons,
      }}
      {...props}
    />
  );
};

export { Toaster };
