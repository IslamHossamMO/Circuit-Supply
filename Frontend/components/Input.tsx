"use client";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`border rounded px-3 py-2 w-full focus:ring focus:ring-blue-300 ${props.className ?? ""}`}
    />
  );
}
