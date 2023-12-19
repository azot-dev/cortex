import { FC, PropsWithChildren } from 'react';

export const Container: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => {
  return (
    <div
      className="bg-slate-800 h-screen flex justify-center items-center gap-5"
      {...props}
    >
      {children}
    </div>
  );
};
