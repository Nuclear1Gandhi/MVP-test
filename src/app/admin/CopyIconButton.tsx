"use client";

import { buttonClassName } from "@/components/atoms/buttonClassName";
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useEffect, useState } from "react";

import { CopyOutlineIcon } from "./svg/CopyOutlineIcon";

export type CopyIconButtonProps = {
  text: string;
  /** Shown in the tooltip before copy; also used for the button `aria-label`. */
  label: string;
};

/**
 * * Copies `text` to the clipboard; tooltip shows confirmation above the trigger when successful.
 */
export function CopyIconButton({ text, label }: CopyIconButtonProps) {
  const [copied, setCopied] = useState(false);
  const [hoverOpen, setHoverOpen] = useState(false);

  const tooltipOpen = copied || hoverOpen;

  useEffect(() => {
    if (!copied) {
      return;
    }
    const id = window.setTimeout(() => {
      setCopied(false);
      // * Clears stale hover open after blocking `onOpenChange(false)` while copied.
      setHoverOpen(false);
    }, 2000);
    return () => {
      window.clearTimeout(id);
    };
  }, [copied]);

  function handleOpenChange(next: boolean) {
    if (!next && copied) {
      return;
    }
    setHoverOpen(next);
  }

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // * Clipboard may be unavailable or denied; avoids surfacing as an unhandled rejection.
    }
  }

  return (
    <Tooltip open={tooltipOpen} onOpenChange={handleOpenChange} delayDuration={250}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          aria-label={label}
          className={buttonClassName({
            variant: "outline",
            size: "sm",
            className:
              "inline-flex !h-6 !w-6 min-h-6 min-w-6 shrink-0 !p-0 items-center justify-center text-app-muted hover:text-app-text",
          })}
        >
          <CopyOutlineIcon />
        </button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side="top"
          sideOffset={6}
          collisionPadding={12}
          className="z-50 max-w-[min(calc(100vw-1rem),18rem)] rounded-md border border-app-border bg-app-surface px-2.5 py-1.5 text-xs leading-snug text-app-text shadow-[var(--shadow-card)]"
        >
          {copied ? "Copied to clipboard" : label}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}
