export default function BrandLogo({ size = 48, className = "" }) {
  return (
    <img
      src="/budget-lily.png"
      alt="Budget Lily logo"
      width={size}
      height={size}
      className={`rounded-md object-cover ${className}`}
    />
  );
}
