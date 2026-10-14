import { createContext, useContext } from 'react';

const OTPContext = createContext({ value: '', focused: false });

function InputOTP({ maxLength = 6, value = '', onChange, autoFocus, autoComplete, children }) {
  return (
    <OTPContext.Provider value={{ value }}>
      <div className="relative inline-block">
        {children}
        <input
          className="absolute inset-0 w-full h-full opacity-0 cursor-text"
          inputMode="numeric"
          maxLength={maxLength}
          value={value}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value.replace(/\D/g, '').slice(0, maxLength))}
        />
      </div>
    </OTPContext.Provider>
  );
}

function InputOTPGroup({ className = '', ...props }) {
  return <div className={`flex items-center gap-2 ${className}`} {...props} />;
}

function InputOTPSlot({ index, className = '' }) {
  const { value } = useContext(OTPContext);
  return (
    <div
      className={`flex h-12 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-lg font-medium ${className}`}
    >
      {value[index] || ''}
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot };