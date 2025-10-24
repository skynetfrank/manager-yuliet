import React from "react";
import { useGetCambioQuery } from "../api/ordersApi";
import { TrendingUp, Euro } from "lucide-react";

const CambioCard = ({ label, value, icon, isError }) => {
  const formattedValue = isError
    ? "No disponible"
    : `Bs. ${Number(value).toLocaleString("es-VE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

  return (
    <div className="cambio-card">
      {icon}
      <span className="cambio-label">{label}:</span>
      <span className={`cambio-value ${isError ? "error" : ""}`}>{formattedValue}</span>
    </div>
  );
};

const CambioMarquee = () => {
  const { data: cambioData, isError, isLoading } = useGetCambioQuery(
    {},
    { pollingInterval: 300000 } // Actualiza cada 5 minutos
  );

  if (isLoading) {
    return null;
  }

  const cards = [
    <CambioCard
      key="bcv"
      label="BCV"
      value={cambioData?.cambiobcv}
      icon={<TrendingUp size={14} />}
      isError={isError || !cambioData?.cambiobcv}
    />,
    <CambioCard
      key="euro"
      label="Euro"
      value={cambioData?.euro}
      icon={<Euro size={14} />}
      isError={isError || !cambioData?.euro}
    />,
  ];

  return (
    <div className="cambio-marquee-container">
      <div className="cambio-marquee-content">
        {cards}
        {cards.map((card) => React.cloneElement(card, { "aria-hidden": true }))}
      </div>
    </div>
  );
};

export default CambioMarquee;