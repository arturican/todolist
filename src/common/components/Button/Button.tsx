type ButtonProps = {
  title: string;
  onClick?: () => void;
  className?: string;
};

export const Button = ({ title, onClick, className }: ButtonProps) => {
  return (
    <button className={className} onClick={onClick}>
      {title}
    </button>
  );
};
