export const Button = ({ className = "", ...props }) => {
    return (
      <button
        className={`bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  };
  