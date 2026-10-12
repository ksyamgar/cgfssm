import React from 'react';
import { toast } from 'react-toastify';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, Radio, ArrowRight } from 'lucide-react';

/**
 * Standard Success Toast
 */
export const notifySuccess = (message, title = 'Operation Successful') => {
  return toast.success(
    React.createElement(
      'div',
      { className: 'flex flex-col gap-0.5' },
      React.createElement('span', { className: 'font-bold text-xs' }, title),
      React.createElement('span', { className: 'text-[11px] opacity-90 leading-tight' }, message)
    ),
    {
      icon: React.createElement(CheckCircle2, { className: 'text-emerald-500', size: 18 })
    }
  );
};

/**
 * Standard Error Toast
 */
export const notifyError = (message, title = 'Action Failed') => {
  return toast.error(
    React.createElement(
      'div',
      { className: 'flex flex-col gap-0.5' },
      React.createElement('span', { className: 'font-bold text-xs' }, title),
      React.createElement('span', { className: 'text-[11px] opacity-90 leading-tight' }, message)
    ),
    {
      icon: React.createElement(AlertCircle, { className: 'text-rose-500', size: 18 })
    }
  );
};

/**
 * Standard Info Toast
 */
export const notifyInfo = (message, title = 'Notice') => {
  return toast.info(
    React.createElement(
      'div',
      { className: 'flex flex-col gap-0.5' },
      React.createElement('span', { className: 'font-bold text-xs' }, title),
      React.createElement('span', { className: 'text-[11px] opacity-90 leading-tight' }, message)
    ),
    {
      icon: React.createElement(Info, { className: 'text-sky-500', size: 18 })
    }
  );
};

/**
 * Standard Warning Toast
 */
export const notifyWarning = (message, title = 'Attention Required') => {
  return toast.warn(
    React.createElement(
      'div',
      { className: 'flex flex-col gap-0.5' },
      React.createElement('span', { className: 'font-bold text-xs' }, title),
      React.createElement('span', { className: 'text-[11px] opacity-90 leading-tight' }, message)
    ),
    {
      icon: React.createElement(AlertTriangle, { className: 'text-amber-500', size: 18 })
    }
  );
};

/**
 * Interactive Action Toast with Clickable Button
 */
export const notifyInteractive = ({
  title,
  message,
  actionLabel,
  onAction,
  type = 'info'
}) => {
  const toastFn = toast[type] || toast.info;

  return toastFn(
    ({ closeToast }) =>
      React.createElement(
        'div',
        { className: 'space-y-1.5 py-0.5' },
        React.createElement('div', { className: 'font-bold text-xs leading-tight' }, title),
        React.createElement('div', { className: 'text-[11px] opacity-90 leading-tight' }, message),
        actionLabel
          ? React.createElement(
              'button',
              {
                onClick: (e) => {
                  e.stopPropagation();
                  if (onAction) onAction();
                  closeToast();
                },
                className:
                  'mt-1 px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-[10px] font-bold shadow-xs flex items-center gap-1 transition-all'
              },
              React.createElement('span', null, actionLabel),
              React.createElement(ArrowRight, { size: 10 })
            )
          : null
      ),
    {
      autoClose: 5000,
      closeOnClick: false
    }
  );
};

/**
 * Live Telemetry / GPS Sync Toast
 */
export const notifyGpsSync = (count, host = 'app.traqindia.com') => {
  return toast.success(
    React.createElement(
      'div',
      { className: 'space-y-0.5' },
      React.createElement(
        'div',
        { className: 'font-bold text-xs flex items-center gap-1.5' },
        React.createElement(Radio, { size: 13, className: 'text-teal-400 animate-pulse' }),
        React.createElement('span', null, 'TraqIndia GPS Synchronized')
      ),
      React.createElement(
        'div',
        { className: 'text-[11px] opacity-90' },
        `Live telemetry updated for ${count} fleet vehicles from ${host}.`
      )
    ),
    {
      autoClose: 3500
    }
  );
};

/**
 * Re-export the base toast instance
 */
export { toast };
export default toast;
