import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FormInput = ({ label, id, ...rest }: FormInputProps) => {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium dark:text-white">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className="p-3 rounded-md bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 focus:invalid:ring-red-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-petrol-500"
      />
    </div>
  );
};

export default FormInput;
