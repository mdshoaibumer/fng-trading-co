/**
 * React's experimental <ViewTransition> (and the cross-document
 * @view-transition in globals.css) can leave an *uncaught* promise rejection
 * when a transition is superseded or aborted — e.g. the very first navigation
 * racing the cross-document transition, or a fast visitor navigating again
 * before the previous transition settles. The browser surfaces this as
 * "InvalidStateError: Transition was aborted because of invalid state".
 *
 * It is benign: the navigation still completes and the page renders correctly;
 * only the console shows an error. This registers a rejection handler as an
 * INLINE script that runs at document-parse time — before React hydrates and
 * before the first transition can fire — so even the initial-load rejection is
 * swallowed. It matches by message, so unrelated InvalidStateErrors still
 * surface normally.
 */
export default function TransitionErrorGuard() {
  const js = `(function(){try{window.addEventListener('unhandledrejection',function(e){var r=e&&e.reason;var m=(r&&(r.message||String(r)))||'';if(/transition was aborted|the transition was skipped|aborted because of invalid state|view transition/i.test(m)){e.preventDefault();}});}catch(_){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
