import React from "react";
import { ParagraphList as ParagraphListType } from "../../constants/articles";
import clsx from "clsx";

export function ParagraphList({
  listTitle,
  listItems,
  numericList,
}: ParagraphListType) {
  return (
    <ul
      className={clsx(
        "list-inside",
        numericList ? "list-decimal" : "list-disc"
      )}
    >
      <label className="font-semibold">{listTitle}</label>

      {listItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
