'use client';

import { useSyncExternalStore } from 'react';

/** Never emits, so the snapshot is only ever read at hydration and after. */
const neverChanges = () => () => {};
const onClient = () => true;
const onServer = () => false;

/**
 * True only after hydration has finished.
 *
 * Scroll-linked motion values are the reason this exists: `useScroll` reports
 * 0 during SSR, but by the time React hydrates the browser may already have
 * restored a previous scroll position, so the two renders disagree and React
 * logs a hydration mismatch. Gating those styles on this keeps the server
 * markup and the hydration render identical, and Framer Motion takes over on
 * the render immediately after.
 *
 * `useSyncExternalStore` is the right primitive here rather than
 * `useState` + `useEffect`: React deliberately uses the server snapshot for
 * the hydration pass and the client snapshot afterwards, so we get the switch
 * without scheduling a cascading state update in an effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(neverChanges, onClient, onServer);
}
