import { buttonClassName } from "@/components/atoms";
import Link from "next/link";

/** * Confirmation after a successful submission. */
export default function SubmitSuccessPage() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-16 text-center sm:px-6">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-app-success-highlight bg-app-success-subtle text-app-success"
        aria-hidden
      >
        <span className="text-2xl">✓</span>
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-app-text">Submission received</h1>
      <p className="text-sm leading-relaxed text-app-muted">
        Your entry is <strong className="font-medium text-app-text">pending</strong>. You will be
        able to track status in a future release; for this MVP it is stored securely in the database
        for admin review.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/submit" className={buttonClassName({ variant: "primary" })}>
          Submit another
        </Link>
      </div>
    </div>
  );
}
