/**
 * Greeting.jsx
 *
 * Renders the Home Experience's greeting text. Fully backend-driven —
 * no fallback/default greeting copy is hardcoded. If no greeting text is
 * available, renders nothing rather than showing placeholder content.
 */

import React from 'react';
import { classNames } from '../../utils/helpers';
import './Greeting.css';

function Greeting({ text, className }) {
  if (!text) return null;

  return <h1 className={classNames('greeting', className)}>{text}</h1>;
}

export default Greeting;