import marca1 from "../assets/marcas/marca1.svg";
import marca2 from "../assets/marcas/marca2.svg";
import marca3 from "../assets/marcas/marca3.svg";
import marca4 from "../assets/marcas/marca4.svg";
import marca6 from "../assets/marcas/marca6.svg";
import marca8 from "../assets/marcas/marca8.svg";
import marca9 from "../assets/marcas/marca9.svg";
import marca10 from "../assets/marcas/marca10.svg";
import marca12 from "../assets/marcas/marca12.svg";
import marca13 from "../assets/marcas/marca13.svg";
import marca14 from "../assets/marcas/marca14.svg";
import marca15 from "../assets/marcas/marca15.svg";
import marca16 from "../assets/marcas/marca16.svg";
import marca17 from "../assets/marcas/marca17.svg";
import marca18 from "../assets/marcas/marca18.svg";

const BrandMarquee = () => {
  const brandLogos = [
    marca1,
    marca2,
    marca3,
    marca4,
    marca6,
    marca8,
    marca9,
    marca10,
    marca12,
    marca13,
    marca14,
    marca15,
    marca16,
    marca17,
    marca18,
  ];

  return (
    <div className="marquee-container" style={{ flex: 1, marginLeft: "auto" }}>
      <div className="marquee-content">
        {[...brandLogos, ...brandLogos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Marca ${(index % brandLogos.length) + 1}`}
            className="brand-logo-marquee"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
