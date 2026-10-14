import { forwardRef } from 'react';

const Label = forwardRef(({ className = '', ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none ${className}`}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };