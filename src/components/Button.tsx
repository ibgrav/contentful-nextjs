import { FC, useState } from "react";

export interface ButtonProps {
  initialCount: number;
}

const Button: FC<ButtonProps> = ({ initialCount = 0 }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <button style={{ color: "green" }} onClick={() => setCount((count) => count + 1)}>
      Count - {count}
    </button>
  );
};

export default Button;
