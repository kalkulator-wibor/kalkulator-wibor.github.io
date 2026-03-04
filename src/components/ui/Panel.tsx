interface PanelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'form';
}

export function Panel({ children, className = '', as: Tag = 'div', ...rest }: PanelProps) {
  return <Tag className={`bg-white rounded-xl shadow-lg ${className}`} {...rest}>{children}</Tag>;
}
