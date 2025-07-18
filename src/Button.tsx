type ButtonProps = {
  title: string;
};

export const Button = ({ title }: ButtonProps) => {
  return <button>{title}</button>;
};
