type ButtonProps = {
  title: string;
  onClick?: () => void;
};

export const Button = ({ title, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{title}</button>;
};
