import clsx from 'clsx';

const variantClasses = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger'
};

const sizeClasses = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) {
  const classes = clsx(
    'btn',
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size] || sizeClasses.md,
    {
      'btn-disabled': props.disabled
    },
    className
  );

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

