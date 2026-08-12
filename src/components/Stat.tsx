export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[0.6875rem] font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </dt>
      <dd className="mono mt-0.5 text-sm font-medium text-ink" title={hint}>
        {value}
      </dd>
    </div>
  );
}
