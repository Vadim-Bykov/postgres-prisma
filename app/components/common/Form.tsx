import {
  DetailedHTMLProps,
  FormHTMLAttributes,
  PropsWithChildren,
} from "react";

/**
 * Safari v16.3 has a bug, when it reloads the page when submit button in a form
 * is disabled and user presses "Enter" on any form field.
 * In this case `onSubmit` handler on a form is not called, so it's impossible
 * to call `preventDefault` on a submission event.
 *
 * Looks like this was fixed in v16.4, (see [release notes for v16.4](https://developer.apple.com/documentation/safari-release-notes/safari-16_4-release-notes))
 * look for `Fixed form submissions to cancel JavaScript URL navigations.`
 * At least I cannot reproduce this on 16.5.
 *
 * To work around this issue we prevent all "Enter" presses in a form inputs
 * while submit is disabled. This has no downsides, so we can do this for all browsers,
 * in case earlier Safari versions or any other browser has the same bug.
 *
 */
export function Form({
  children,
  preventSubmission = false,
  ...props
}: PropsWithChildren<
  DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
    preventSubmission?: boolean;
  }
>) {
  return (
    <form
      {...props}
      onKeyDown={(e) => {
        if (preventSubmission && e.key === "Enter") {
          e.preventDefault();
        }

        props.onKeyDown?.(e);
      }}
    >
      {children}
    </form>
  );
}
