import React from 'react';

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface SheetContentProps {
  side?: 'left' | 'right';
  className?: string;
  children: React.ReactNode;
}

interface SheetHeaderProps {
  children: React.ReactNode;
}

interface SheetTitleProps {
  className?: string;
  children: React.ReactNode;
}

interface SheetDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const SheetContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
}>({
  open: false,
  onOpenChange: () => {}
});

export const Sheet: React.FC<SheetProps> = ({ open = false, onOpenChange = () => {}, children }) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

export const SheetTrigger = React.forwardRef<HTMLButtonElement, SheetTriggerProps>(
  ({ asChild, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(SheetContext);
    
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ref,
        onClick: (e: React.MouseEvent) => {
          children.props.onClick?.(e);
          onOpenChange(true);
        }
      });
    }
    
    return (
      <button ref={ref} onClick={() => onOpenChange(true)} {...props}>
        {children}
      </button>
    );
  }
);

SheetTrigger.displayName = 'SheetTrigger';

export const SheetContent: React.FC<SheetContentProps> = ({ side = 'right', className = '', children }) => {
  const { open, onOpenChange } = React.useContext(SheetContext);
  
  if (!open) return null;
  
  const sideClasses = {
    left: 'left-0',
    right: 'right-0'
  };
  
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => onOpenChange(false)}
      />
      <div className={`fixed top-0 ${sideClasses[side]} h-full bg-white z-50 shadow-lg ${className}`}>
        {children}
      </div>
    </>
  );
};

export const SheetHeader: React.FC<SheetHeaderProps> = ({ children }) => {
  return <div className="p-6 border-b">{children}</div>;
};

export const SheetTitle: React.FC<SheetTitleProps> = ({ className = '', children }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};

export const SheetDescription: React.FC<SheetDescriptionProps> = ({ className = '', children }) => {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
};