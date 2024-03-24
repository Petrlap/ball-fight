import React from "react";
import Game from "./components/Game";

const App: React.FC = () => {
  return (
    <div>
      <h1 className="title">Бойня шаров</h1>
      <Game />
    </div>
  );
};

export default App;
