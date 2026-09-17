import type { Contact } from "../lib/types";

export function ResumePhoto({
  contact,
  className = "",
  size = 76,
}: {
  contact: Contact;
  className?: string;
  size?: number;
}) {
  if (!contact.photoUrl || contact.showPhoto === false) return null;

  const styleClass =
    contact.photoStyle === "square"
      ? "rounded-none"
      : contact.photoStyle === "rounded"
      ? "rounded-2xl"
      : "rounded-full";

  return (
    <div
      className={`relative shrink-0 overflow-hidden border-2 border-white/90 shadow-md ${styleClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={contact.photoUrl}
        alt={contact.fullName ? `${contact.fullName} headshot` : "Profile photo"}
        className="h-full w-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
