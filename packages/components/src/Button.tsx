import { FC, useState } from "react";

export interface ButtonProps {
  initialCount: number;
}

export const Button: FC<ButtonProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <button style={{ color: "blue" }} onClick={() => setCount((count) => count + 1)}>
      Count - {count}
    </button>
  );
};
