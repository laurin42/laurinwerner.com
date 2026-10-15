type StackTagsProps = {
  items: string[];
  label: string;
};

/** Technologies as a quiet inline list: `Next.js · TypeScript · …`. */
export function StackTags({ items, label }: StackTagsProps) {
  return (
    <ul
      aria-label={label}
      className="flex flex-wrap type-label text-muted-foreground"
    >
      {items.map((item, index) => (
        <li key={item}>
          {index > 0 && <span aria-hidden="true">&nbsp;·&nbsp;</span>}
          {item}
        </li>
      ))}
    </ul>
  );
}
