function Loader(props) {
  return (
    <div className="flx jcenter font-1">
      <div className={props.tipo === "mini" ? "loader mini" : "loader"}></div>
      <span>{props.txt}</span>
    </div>
  );
}

export default Loader;
