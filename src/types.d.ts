export interface Ball {
  id: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  dx: number;
  dy: number;
}
export interface Props {
  selectedBall: Ball | null;
  setIsColorMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldRender: React.Dispatch<React.SetStateAction<boolean>>;
}
export interface CanvasProps {
  isGameActive: boolean;
  setIsColorMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedBall: React.Dispatch<React.SetStateAction<Ball | null>>;
  ballsRef: React.MutableRefObject<Ball[]>;
}
