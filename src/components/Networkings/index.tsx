import style from "./style.module.scss";

interface NetworkingCardProps {
  networking: any;
  featured?: boolean;
}

export default function NetworkingCard({
  networking,
  featured = false,
}: NetworkingCardProps) {
  const { fields } = networking;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const companies = fields.companies || [];

  return (
    <div
      className={`${style["networking-card"]} ${
        featured ? style["networking-card--featured"] : ""
      }`}
    >
      <div className={style["networking-card__content"]}>
        <span style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:"8px", fontSize:"0.9rem", color:"#ffffff80"}}>
        <h3 className={style["networking-card__title"]}>{fields.name}</h3>

        <div className={style["networking-card__meta"]}>
          {fields.date && (
            <span className={style["networking-card__date"]}>
              {formatDate(fields.date)}
            </span>
          )}
          {fields.date && (
            <span className={style["networking-card__time"]}>
              {formatTime(fields.date)}
            </span>
          )}
        </div>
        </span>

        {fields.location && (
          <div className={style["networking-card__map"]}>
            <iframe
              title="Event location"
              width="400px"
              height="200"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${fields.location.lon - 0.01}%2C${fields.location.lat - 0.007}%2C${fields.location.lon + 0.01}%2C${fields.location.lat + 0.007}&layer=mapnik&marker=${fields.location.lat}%2C${fields.location.lon}`}
            />
          </div>
        )}

        {companies.length > 0 && (
          <div className={style["networking-card__companies"]}>
            <div className={style["networking-card__logos"]}>
              {companies.map((company: any, index: number) => {
                const imageUrl = company.fields?.image?.fields?.file?.url;
                return imageUrl ? (
                  <a
                    key={index}
                    href={company.fields?.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style["networking-card__logo-link"]}
                  >
                    <img
                      src={`https:${imageUrl}`}
                      alt={company.fields?.name || "Company"}
                      className={style["networking-card__logo"]}
                    />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
