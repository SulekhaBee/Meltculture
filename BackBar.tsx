import { useNavigate } from 'react-router-dom';

export default function BackBar({ label }: { label?: string }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-40 lg:hidden bg-[#fdf6ed]/95 backdrop-blur-sm border-b border-[#e2ceae] flex items-center gap-3 px-4 py-2.5 shadow-sm">
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="flex items-center gap-1.5 text-[#2c1a10] text-[13px] font-bold hover:text-[#d97706] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] rounded"
        style={{ fontFamily: 'Manrope' }}
      >
        <span className="text-[16px] leading-none">←</span>
        <span>Back</span>
      </button>
      {label && (
        <>
          <span className="text-[#e2ceae] text-[12px]">/</span>
          <p
            className="text-[#2c1a10] text-[13px] font-semibold truncate"
            style={{ fontFamily: 'Manrope' }}
          >
            {label}
          </p>
        </>
      )}
    </div>
  );
}
