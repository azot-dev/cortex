import { FC, PropsWithChildren } from 'react';

export const Button: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLButtonElement>>
> = ({ children, ...props }) => {
  return (
    <button className="flex h-12 w-12 justify-center items-center" {...props}>
      <div className="text-white text-2xl">{children}</div>
    </button>
  );
};
