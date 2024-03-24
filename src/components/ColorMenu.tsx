// ColorMenu.tsx
import React, { useCallback } from "react";
import { Props } from "../types";

function ColorMenu({
  selectedBall,
  setIsColorMenuOpen,
  setShouldRender,
}: Props) {
  const handleColorChange = useCallback(
    (color: string) => {
      if (selectedBall) {
        selectedBall.color = color;
        setIsColorMenuOpen(false);
        setShouldRender((prevState) => !prevState);
      }
    },
    [selectedBall, setIsColorMenuOpen, setShouldRender]
  );

  if (!selectedBall) return null;

  return (
    <div className="modal">
      <button
        className="modal__button pink"
        onClick={() => handleColorChange("rgba(255, 94, 247, 1)")}
      >
        Розовый
      </button>
      <button
        className="modal__button blue"
        onClick={() => handleColorChange("rgba(2, 245, 255, 1)")}
      >
        Голубой
      </button>
      <button
        className="modal__button dark-blue"
        onClick={() => handleColorChange("rgba(2, 19, 255, 1)")}
      >
        Синий
      </button>
    </div>
  );
}

export default ColorMenu;
