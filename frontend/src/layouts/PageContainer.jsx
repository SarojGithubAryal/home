/**
 * PageContainer.jsx
 *
 * The single reusable page-level wrapper. Every page renders its content
 * inside this container so loading/error/empty state handling is
 * consistent across the entire application, rather than each page
 * re-implementing its own loading/error branching.
 *
 * This component receives props only — it does not call any hook or
 * service itself. The calling page is responsible for calling its own
 * data hook (useHome, useRoom, etc.) and passing the resulting
 * loading/error/empty flags down as props.
 *
 * State exposure: this component explicitly sets a `data-state`
 * attribute reflecting which of its four states (loading / error /
 * empty / content) is currently active. PageContainer.css keys off this
 * attribute directly rather than inferring state from DOM structure —
 * state is a decision this component makes, not something CSS should
 * have to detect.
 */

import React from 'react';
import './PageContainer.css';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { classNames, isEmptyValue } from '../utils/helpers';

/**
 * @param {object} props
 * @param {boolean} props.loading - whether the page's primary data is loading
 * @param {{code: string, message: string}|null} props.error - error from a hook, if any
 * @param {*} [props.data] - the page's primary data, used to determine empty state
 *   if isEmpty is not explicitly provided
 * @param {boolean} [props.isEmpty] - explicit empty-state override; if omitted,
 *   falls back to isEmptyValue(data)
 * @param {() => void} [props.onRetry] - retry handler passed to ErrorState
 * @param {string} [props.emptyTitle] - title passed to EmptyState
 * @param {string} [props.emptyMessage] - message passed to EmptyState
 * @param {string} [props.className] - additional class names for the container
 * @param {React.ReactNode} props.children - the page content to render once
 *   loading/error/empty states are all clear
 */
function PageContainer({
  loading = false,
  error = null,
  data,
  isEmpty,
  onRetry,
  emptyTitle,
  emptyMessage,
  className,
  children,
}) {
  const resolvedIsEmpty = typeof isEmpty === 'boolean' ? isEmpty : isEmptyValue(data);

  // Explicit, component-owned state decision — never inferred by CSS.
  const state = loading
    ? 'loading'
    : error
    ? 'error'
    : resolvedIsEmpty
    ? 'empty'
    : 'content';

  return (
    <div className={classNames('page-container', className)} data-state={state}>
      {state === 'loading' && <Loading />}
      {state === 'error' && <ErrorState error={error} onRetry={onRetry} />}
      {state === 'empty' && <EmptyState title={emptyTitle} message={emptyMessage} />}
      {state === 'content' && children}
    </div>
  );
}

export default PageContainer;