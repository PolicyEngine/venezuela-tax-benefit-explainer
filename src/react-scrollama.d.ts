declare module "react-scrollama" {
  import { ReactNode } from "react";

  interface ScrollamaProps {
    onStepEnter?: (response: {
      data: any;
      entry: IntersectionObserverEntry;
    }) => void;
    onStepExit?: (response: {
      data: any;
      entry: IntersectionObserverEntry;
      direction: string;
    }) => void;
    onStepProgress?: (response: { data: any; progress: number }) => void;
    offset?: number;
    threshold?: number;
    debug?: boolean;
    children: ReactNode;
  }

  interface StepProps {
    data: any;
    children: ReactNode;
  }

  export const Scrollama: React.FC<ScrollamaProps>;
  export const Step: React.FC<StepProps>;
}
