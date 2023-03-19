import { PropsWithChildren, useEffect, useState } from "react";

export const BrowserOnly = ({ children }: PropsWithChildren<{}>) => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return (
    <div suppressHydrationWarning className="h-full">
      {isSSR ? null : children}
    </div>
  );
};
