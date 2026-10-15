import { Fragment } from "react";

/** The name as one inline-block span per word, so <NameMorph> can move each word. */
export function NameWords({ name }: { name: string }) {
  return name.split(" ").map((word, index) => (
    <Fragment key={word}>
      {index > 0 && " "}
      <span data-name-word className="inline-block">
        {word}
      </span>
    </Fragment>
  ));
}
