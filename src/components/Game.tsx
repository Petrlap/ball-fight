import React, { useRef, useState, useCallback } from "react";
import ColorMenu from "./ColorMenu";
import { Ball } from "../types";
import Canvas from "./Canvas";

const BilliardsGame: React.FC = () => {
  const [selectedBall, setSelectedBall] = useState<Ball | null>(null);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState<boolean>(false);
  const [shouldRender, setShouldRender] = useState<boolean>(false);
  const ballsRef = useRef<Ball[]>([]);

  const [isGameActive, setIsGameActive] = useState<boolean>(true);

  const handleToggleGame = useCallback(() => {
    setIsGameActive((prevState) => !prevState);
  }, []);
  return (
    <div>
      <Canvas
        isGameActive={isGameActive}
        setIsColorMenuOpen={setIsColorMenuOpen}
        setSelectedBall={setSelectedBall}
        ballsRef={ballsRef}
      />
      {isColorMenuOpen && selectedBall && (
        <ColorMenu
          selectedBall={selectedBall}
          setIsColorMenuOpen={setIsColorMenuOpen}
          setShouldRender={setShouldRender}
        />
      )}
      <div className="container">
        <button className="button" onClick={handleToggleGame}>
          {isGameActive ? "Остановить шары" : "Вернуться к игре"}
        </button>
      </div>
    </div>
  );
};

export default BilliardsGame;
