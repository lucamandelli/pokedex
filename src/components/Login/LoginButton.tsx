import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-poke-red hover:bg-red-700 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out drop-shadow-lg"
    >
      {children}
    </button>
  )
};

export default Button;