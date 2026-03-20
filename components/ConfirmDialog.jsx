'use client';

import { useEffect, useRef } from 'react';

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      onCancel={onCancel}
      className="rounded-2xl p-6 shadow-xl backdrop:bg-black/40 max-w-xs w-full mx-auto border-0"
    >
      <p className="text-base font-medium text-gray-800 text-center">{message}</p>
      <div className="flex gap-3 mt-5">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 active:bg-gray-50"
        >
          Keep it
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 rounded-xl bg-red-500 text-white py-2.5 text-sm font-medium active:bg-red-600"
        >
          Cancel it
        </button>
      </div>
    </dialog>
  );
}
