import React, { useEffect, useState } from "react";
import { useFetchUser } from "../globalHooks";
import GlobalHeader from "./GlobalHeader";
import CopyRightFooter from "./CopyRightFooter";

const AppWrapperHOC = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const HOCComponent: React.FC<P> = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const userInfo = useFetchUser();
    

  useEffect(() => {
    setIsLoading(false);
  }, []);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <>
      <GlobalHeader />
      <WrappedComponent {...props} userInfo={userInfo} />
      <CopyRightFooter/>
      </>
    );
  };

  return HOCComponent;
};

export default AppWrapperHOC;
