import { BUSINESS } from "@/lib/business";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";

export function WhatsAppFloat() {
  return (
    <a
      href={BUSINESS.social.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us live on WhatsApp"
      className="group fixed bottom-5 left-5 z-50 flex h-11 w-11 items-center justify-center sm:bottom-6 sm:left-6 sm:h-12 sm:w-12"
    >
      {/* Live pulse ring */}
      <span
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-60"
        aria-hidden="true"
      />
      <span
        className="relative flex h-full w-full items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-[#25D366]/40"
        aria-hidden="true"
      >
        <WhatsAppIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>
      <span
        className="absolute -right-0.5 -top-0.5 z-10 h-2.5 w-2.5 rounded-full border border-white bg-green-400"
        aria-hidden="true"
      />
      <span className="sr-only">WhatsApp Live Chat</span>
      <span
        className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:block"
        aria-hidden="true"
      >
        Chat with us
      </span>
    </a>
  );
}
