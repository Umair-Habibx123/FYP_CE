import { useEffect, useState } from "react";

export default function Preloader() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight}px`);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.pageX - 16, y: e.pageY - 16 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClick = (e) => {
    setClicks([...clicks, { x: e.pageX - 16, y: e.pageY - 16, id: Date.now() }]);
    setTimeout(() => {
      setClicks((prev) => prev.filter((click) => click.id !== Date.now()));
    }, 500);
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center overflow-hidden bg-white relative"
      onClick={handleClick}
    >
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <img
          src="http://a.top4top.net/p_1990j031.gif"
          alt="Loading"
          className="min-w-[200px] min-h-[209px]"
        />
      </div>
      <div
        className="absolute bg-yellow-300 rounded-full transition-all duration-200 ease-in-out"
        style={{
          width: "25px",
          height: "25px",
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      ></div>
      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute bg-yellow-300 rounded-full w-[25px] h-[25px]"
          style={{ left: `${click.x}px`, top: `${click.y}px` }}
        ></div>
      ))}
    </div>
  );
}
