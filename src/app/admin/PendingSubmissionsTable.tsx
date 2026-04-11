"use client";

import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useMemo, useState } from "react";

import { CopyIconButton } from "./CopyIconButton";
import { PreviewLightbox } from "./PreviewLightbox";
import {
  SortHeaderButton,
  type SortColumn,
  type SortDirection,
} from "./SortHeaderButton";
import { MagnifyOutlineIcon } from "./svg/MagnifyOutlineIcon";

/**
 * * Formats an ISO timestamp for display with a fixed locale and time zone so SSR and the browser match.
 */
function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "UTC",
    year: "2-digit",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * * Serializable row for the pending submissions admin table (built on the server).
 */
export type PendingSubmissionTableRow = {
  id: string;
  identifier: string;
  typeLabel: string;
  user_id: string;
  user_email: string | null;
  created_at: string | null;
  previewUrl: string | null;
};

type PendingSubmissionsTableProps = {
  rows: PendingSubmissionTableRow[];
};

/**
 * * Sortable admin table for pending submissions with copy actions.
 */
export function PendingSubmissionsTable({ rows }: PendingSubmissionsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("submitted");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  const sortedRows = useMemo(() => {
    const out = [...rows];
    const dir = sortDir === "asc" ? 1 : -1;

    out.sort((a, b) => {
      let cmp = 0;
      switch (sortColumn) {
        case "identifier":
          cmp = a.identifier.localeCompare(b.identifier, undefined, {
            sensitivity: "base",
          });
          break;
        case "type":
          cmp = a.typeLabel.localeCompare(b.typeLabel, undefined, {
            sensitivity: "base",
          });
          break;
        case "user": {
          const ae = (a.user_email ?? "").toLowerCase();
          const be = (b.user_email ?? "").toLowerCase();
          cmp = ae.localeCompare(be, undefined, { sensitivity: "base" });
          if (cmp === 0) {
            cmp = a.user_id.localeCompare(b.user_id, undefined, {
              sensitivity: "base",
            });
          }
          break;
        }
        case "submitted": {
          const ta = a.created_at ? new Date(a.created_at).getTime() : null;
          const tb = b.created_at ? new Date(b.created_at).getTime() : null;
          if (ta === null && tb === null) {
            cmp = 0;
          } else if (ta === null) {
            cmp = 1;
          } else if (tb === null) {
            cmp = -1;
          } else {
            cmp = ta - tb;
          }
          break;
        }
        default:
          cmp = 0;
      }
      return cmp * dir;
    });

    return out;
  }, [rows, sortColumn, sortDir]);

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortColumn(column);
    // * Submitted defaults to descending (newest first); other columns start ascending.
    setSortDir(column === "submitted" ? "desc" : "asc");
  }

  if (rows.length === 0) {
    return (
      <p className="mt-10 text-sm text-app-muted">
        No pending submissions. When users submit, they appear here — click Refresh above to check for new ones.
      </p>
    );
  }

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={200} disableHoverableContent>
      {lightboxSrc ? (
        <PreviewLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      ) : null}
      <div className="mt-8 overflow-x-auto rounded-xl border border-app-border shadow-[var(--shadow-card)]">
      <table className="w-full min-w-[800px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-app-border bg-app-offset">
            <th className="p-3 font-medium text-app-text" scope="col">
              Preview
            </th>
            <SortHeaderButton
              column="identifier"
              label="Identifier"
              activeColumn={sortColumn}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortHeaderButton
              column="type"
              label="Type"
              activeColumn={sortColumn}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortHeaderButton
              column="user"
              label="User"
              activeColumn={sortColumn}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <SortHeaderButton
              column="submitted"
              label="Submitted"
              activeColumn={sortColumn}
              sortDir={sortDir}
              onSort={handleSort}
            />
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-app-divider bg-app-surface last:border-0"
            >
              <td className="p-3 align-top">
                {row.previewUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      setLightboxSrc(row.previewUrl);
                    }}
                    className="group relative h-16 w-16 shrink-0 cursor-zoom-in overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]"
                    aria-label="View larger preview"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- signed external URLs */}
                    <img
                      src={row.previewUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <span
                      className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-md bg-black/45 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
                      aria-hidden
                    >
                      <MagnifyOutlineIcon />
                    </span>
                  </button>
                ) : (
                  <span className="text-xs text-app-faint">No preview</span>
                )}
              </td>
              <td className="p-3 align-top">
                <div className="flex flex-wrap items-start gap-2">
                  <span className="min-w-0 break-all font-mono text-xs text-app-text">
                    {row.identifier}
                  </span>
                  <CopyIconButton text={row.identifier} label="Copy identifier" />
                </div>
              </td>
              <td className="p-3 align-top text-app-muted">{row.typeLabel}</td>
              <td className="p-3 align-top">
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 break-all text-xs text-app-muted">
                      {row.user_email ?? "—"}
                    </span>
                    {row.user_email ? (
                      <CopyIconButton text={row.user_email} label="Copy email" />
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 break-all font-mono text-xs text-app-muted">
                      {row.user_id}
                    </span>
                    <CopyIconButton text={row.user_id} label="Copy user id" />
                  </div>
                </div>
              </td>
              <td className="p-3 align-top text-app-muted">
                {row.created_at ? formatSubmittedAt(row.created_at) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </TooltipProvider>
  );
}
