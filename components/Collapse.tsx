import React, { useEffect, useState } from "react";
import { useCollapse } from "react-collapsed";

interface Props {
  isActive: boolean;
  children: React.ReactNode;
}

const Collapse = ({ isActive, children }: Props) => {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const { getCollapseProps } = useCollapse({ isExpanded });

  useEffect(() => {
    setIsExpanded(isActive);
  }, [isActive]);

  return <div {...getCollapseProps()}>{children}</div>;
};

export default Collapse;
