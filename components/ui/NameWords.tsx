import { Fragment } from "react";

/**
 * The name as one inline-block span per word, so <NameMorph> can move each word,
 * ending in a red full stop: the site's mark. The stop is decoration, so the
 * accessible name stays the plain name.
 */
export function NameWords({ name }: { name: string }) {
  const words = name.split(" ");
  return words.map((word, index) => (
    <Fragment key={word}>
      {index > 0 && " "}
      <span data-name-word className="inline-block">
        {word}
        {index === words.length - 1 && (
          <span aria-hidden="true" className="text-accent">
            .
          </span>
        )}
      </span>
    </Fragment>
  ));
}
