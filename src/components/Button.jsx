export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}) {
  const baseStyles = "px-6 py-3 font-semibold uppercase tracking-wider transition-all duration-300 border-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] hover:bg-transparent hover:text-[var(--text-primary)]",
    outline: "bg-transparent text-[var(--text-primary)] border-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)]",
    ghost: "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
