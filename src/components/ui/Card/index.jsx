const Card = ({ children, className, ...props }) => {
  return (
    <div
      {...props}
      className={`shadow-soft p-4 rounded-xl bg-white ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
