import type { MouseEvent, ReactNode } from "react";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

export function MagneticButton({
  href,
  children,
  className = "",
  ariaLabel,
  disabled = false,
}: MagneticButtonProps) {
  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (disabled) return;
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    const x = (event.clientX - bounds.left - bounds.width / 2) * 0.16;
    const y = (event.clientY - bounds.top - bounds.height / 2) * 0.16;
    target.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={`magnetic-button ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </a>
  );
}