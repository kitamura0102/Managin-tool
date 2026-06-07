type EmptyStateProps = {
  title: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, action }: EmptyStateProps) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white px-4 py-8 text-center">
      <p className="text-sm text-ink/60">{title}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
