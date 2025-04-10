export const Input = ({ className = "", ...props }) => {
    return (
      <input
        className={`border border-gray-300 rounded px-3 py-2 ${className}`}
        {...props}
      />
    );
  };
  