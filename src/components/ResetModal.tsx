export function ResetModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-md border-2 border-coral bg-card p-6 shadow-[8px_8px_0_0_rgba(180,40,40,0.8)]">
        <div className="flex items-center gap-3 border-b-2 border-coral/30 pb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xs bg-coral/15 text-coral font-bold text-xl">
            ⚠️
          </span>
          <div>
            <h3 className="font-display text-xl font-black text-neutral-900">
              Reset All Information?
            </h3>
            <p className="font-mono text-[10.5px] uppercase font-semibold text-coral">
              Destructive Action · Irreversible
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-sm text-neutral-700">
          <p>
            Are you sure you want to reset your entire resume? This will permanently erase:
          </p>
          <ul className="list-disc space-y-1 pl-5 font-mono text-xs text-neutral-600">
            <li>Contact details, photo, and social links</li>
            <li>Professional summary and personal statement</li>
            <li>All work experience roles and bullet metrics</li>
            <li>Education, certifications, and languages</li>
            <li>Projects, custom sections, and uploaded keywords</li>
          </ul>
          <p className="font-semibold text-neutral-800">
            You will be given a fresh, blank canvas.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-ink/15 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="border-2 border-ink bg-white px-4 py-2 font-mono text-xs font-bold text-ink hover:bg-neutral-100"
          >
            Cancel &amp; Keep My Resume
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border-2 border-coral bg-coral px-4 py-2 font-mono text-xs font-bold text-white shadow-[2px_2px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 hover:bg-red-700"
          >
            Yes, Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
}
