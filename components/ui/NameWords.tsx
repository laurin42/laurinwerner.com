import { Fragment } from "react";

/**
 * The name as one inline-block span per word, so <NameMorph> can move each word.
 * The last name is set in the accent red: the site's mark.
 */
export function NameWords({ name }: { name: string }) {
  const words = name.split(" ");
  return words.map((word, index) => (
    <Fragment key={word}>
      {index > 0 && " "}
      <span
        data-name-word
        className={`inline-block ${index > 0 && index === words.length - 1 ? "text-accent" : ""}`}
      >
        {word}
      </span>
    </Fragment>
  ));
}
