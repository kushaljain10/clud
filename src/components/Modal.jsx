export default function Modal({ open, title, children, onClose, actions }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-2xl bg-panel shadow-soft border border-border">
          <div className="px-5 pt-5">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <div className="px-5 py-4 text-soft">{children}</div>
          <div className="px-5 pb-5 flex gap-3 justify-end">
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}