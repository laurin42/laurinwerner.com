type StackTagsProps = {
  items: string[];
  label: string;
};

export function StackTags({ items, label }: StackTagsProps) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-border px-2 py-0.5 text-sm"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
