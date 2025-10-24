function ToolTip({ children, text }) {
  return (
    <div className="tooltip">
      {children}
      <span className="tooltip__box">{text}</span>
    </div>
  );
}

export default ToolTip;
