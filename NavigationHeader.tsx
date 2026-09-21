import { Link, useNavigate } from 'react-router-dom';

export type Crumb = { label: string; to?: string };

interface NavigationHeaderProps {
  /** Breadcrumb trail, left-to-right. Last item is the current page (no link needed). */
  crumbs: Crumb[];
  /** Optional context label shown next to the arrow on mobile, e.g. "Collections" */
  backContext?: string;
}

/**
 * Unified sub-header navigation used on every inner page.
 *
 * Mobile  (<768px): sticky bar with "← Back [context]" only — breadcrumb hidden.
 * Desktop (≥768px): "← Back" button + pipe separator + full clickable breadcrumb trail.
 *
 * Back always calls navigate(-1) so it respects the real browser history entry
 * regardless of which page the user came from.
 */
export default function NavigationHeader({ crumbs, backContext }: NavigationHeaderProps) {
  const navigate = useNavigate();

  function handleBack() {
    navigate(-1);
  }

  const backLabel = backContext ? `← Back to ${backContext}` : '← Back';

  return (
    <nav
      aria-label="Page navigation"
      className="sticky top-0 z-40 bg-[#fdf6ed]/95 backdrop-blur-sm border-b border-[#e2ceae] shadow-sm"
    >
      <div className="flex items-center gap-3 px-4 md:px-8 lg:px-20" style={{ minHeight: '48px' }}>
        {/* Back button — visible on all viewport sizes */}
        <button
          onClick={handleBack}
          aria-label="Go back"
          className="flex items-center gap-1.5 text-[#2c1a10] text-[13px] font-bold hover:text-[#d97706] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d97706] rounded shrink-0"
          style={{ fontFamily: 'Manrope', minHeight: '44px' }}
        >
          {/* Mobile: show context label if provided */}
          <span className="text-[15px] leading-none" aria-hidden="true">←</span>
          <span className="md:hidden">{backContext ? `Back to ${backContext}` : 'Back'}</span>
          <span className="hidden md:inline">Back</span>
        </button>

        {/* Desktop-only: pipe + breadcrumb trail */}
        {crumbs.length > 0 && (
          <>
            <span className="hidden md:block text-[#e2ceae] text-[14px] select-none" aria-hidden="true">|</span>
            <ol
              className="hidden md:flex items-center gap-1.5 flex-wrap overflow-hidden"
              aria-label="Breadcrumb"
            >
              {crumbs.map((crumb, i) => {
                const isLast = i === crumbs.length - 1;
                return (
                  <li key={i} className="flex items-center gap-1.5 min-w-0">
                    {i > 0 && (
                      <span className="text-[#b5a08a] text-[12px] select-none" aria-hidden="true">/</span>
                    )}
                    {crumb.to && !isLast ? (
                      <Link
                        to={crumb.to}
                        className="text-[#7a5c44] text-[13px] hover:text-[#d97706] transition-colors truncate"
                        style={{ fontFamily: 'Manrope' }}
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span
                        className="text-[#2c1a10] text-[13px] font-semibold truncate"
                        style={{ fontFamily: 'Manrope' }}
                        aria-current={isLast ? 'page' : undefined}
                      >
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>
    </nav>
  );
}
