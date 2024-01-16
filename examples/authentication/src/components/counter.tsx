import { FC, PropsWithChildren } from 'react';

export const Counter: FC<
  PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>
> = ({ children, ...props }) => {
  return (
    <div
      className="flex h-12 w-12 bg-red-700 rounded-md justify-center items-center"
      {...props}
    >
      <div className="text-white text-2xl">{children}</div>
    </div>
  );
};
