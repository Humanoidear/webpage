import { useTranslation } from "react-i18next";
import style from "./style.module.scss";
import { getNetworkings } from "../../contentful.ts";
import { useState, useEffect, useRef, useCallback } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import NetworkingCard from "../../components/Networkings/index.tsx";

import station01 from "../../assets/icons/station-01.png";
import station02 from "../../assets/icons/station-02.png";
import station03 from "../../assets/icons/station-03.png";
import station04 from "../../assets/icons/station-04.png";
import station05 from "../../assets/icons/station-05.png";
import station06 from "../../assets/icons/station-06.png";
import station07 from "../../assets/icons/station-07.png";
import station08 from "../../assets/icons/station-08.png";

const STATION_ICONS: Record<string, string> = {
  "01": station01,
  "02": station02,
  "03": station03,
  "04": station04,
  "05": station05,
  "06": station06,
  "07": station07,
  "08": station08,
};

const STATION_IDS = ["01", "02", "03", "04", "05", "06", "07", "08"];

export default function NetworkingPage() {
  const [networkings, setNetworkings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const gradient1Ref = useRef<HTMLDivElement>(null);
  const gradient2Ref = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const cx = (clientX / window.innerWidth - 0.5) * 2;
    const cy = (clientY / window.innerHeight - 0.5) * 2;

    if (gradient1Ref.current) {
      gradient1Ref.current.style.transform = `translate(calc(-50% + ${cx * 60}px), calc(-50% + ${cy * 60}px))`;
    }
    if (gradient2Ref.current) {
      gradient2Ref.current.style.transform = `translate(calc(-50% + ${cx * -60}px), calc(-50% + ${cy * -60}px))`;
    }
    if (sectionRef.current) {
      sectionRef.current.style.transform = `translate(${cx * 6}px, ${cy * 6}px)`;
    }
    if (titleRef.current) {
      titleRef.current.style.transform = `translate(${cx * 20}px, ${cy * 20}px)`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const { t } = useTranslation("networking");

  useEffect(() => {
    const fetchNetworkings = async () => {
      try {
        setLoading(true);
        const data = await getNetworkings();
        // Sort by date descending (most recent first)
        const sorted = [...data].sort((a: any, b: any) => {
          const dateA = new Date(a.fields.date || 0).getTime();
          const dateB = new Date(b.fields.date || 0).getTime();
          return dateB - dateA;
        });
        setNetworkings(sorted);
        setError(null);
      } catch (err) {
        console.error("Error fetching networkings:", err);
        setError("Failed to load networking events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkings();
  }, []);

  const mostRecent = networkings.length > 0 ? networkings[0] : null;
  const pastNetworkings = networkings.slice(1);

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

  return (
    <>
      <div className={`${style["networking__section"]} ${style["section-1"]}`}>
        <div className={style["networking__gradients"]}>
          <div className={style["gradient-1"]} ref={gradient1Ref}></div>
          <div className={style["gradient-2"]} ref={gradient2Ref}></div>
        </div>
        <div ref={sectionRef} className={style["networking__content-parallax"]}>
          {loading && (
            <div className={style["loading-state"]}>
              <p>{t("loading")}</p>
            </div>
          )}

          {error && (
            <div className={style["error-state"]}>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && !mostRecent && (
            <div className={style["empty-state"]}>
              <p>{t("no-events")}</p>
            </div>
          )}

          {!loading && !error && mostRecent && (
            <div className={style["featured-networking"]}>
              <span
                style={{ display: "flex", alignItems: "center", gap: "5rem" }}
              >
                <span>
                  <span className={style["featured-networking__header-row"]}>
                    <span className={style["featured-networking__badge-row"]}>
                      <div className={style["featured-networking__badge"]}>
                        {t("latest-event")}
                      </div>
                      {mostRecent.fields.date && (
                        <span className={style["featured-networking__date"]}>
                          {formatDate(mostRecent.fields.date)}
                        </span>
                      )}
                    </span>
                    {mostRecent.fields.date && (
                      <span className={style["featured-networking__time"]}>
                        {formatTime(mostRecent.fields.date)}
                      </span>
                    )}
                  </span>
                  <span className={style["featured-networking__name-map"]}>
                    <h2
                      className={style["featured-networking__name"]}
                      ref={titleRef}
                    >
                      {mostRecent.fields.name}
                    </h2>
                    <span className={style["featured-networking__map-wrapper"]}>
                      {mostRecent.fields.location && (
                        <div className={style["featured-networking__map"]}>
                          <iframe
                            title="Event location"
                            width="400px"
                            height="300"
                            style={{ border: 0, borderRadius: "14px" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${mostRecent.fields.location.lon - 0.01}%2C${mostRecent.fields.location.lat - 0.007}%2C${mostRecent.fields.location.lon + 0.01}%2C${mostRecent.fields.location.lat + 0.007}&layer=mapnik&marker=${mostRecent.fields.location.lat}%2C${mostRecent.fields.location.lon}`}
                          />
                        </div>
                      )}
                    </span>
                  </span>
                </span>
              </span>

              {mostRecent.fields.description && (
                <div className={style["featured-networking__description"]}>
                  {documentToReactComponents(mostRecent.fields.description)}
                </div>
              )}
            </div>
          )}

          <div className={style["chevron-down"]}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {!loading && !error && mostRecent && (
        <div className={style["carousel-section"]}>
          <h2 className={style["carousel-section__title"]}>
            {t("stations-title")}
          </h2>
          <div className={style["carousel"]}>
            <div className={style["carousel__track"]}>
              {STATION_IDS.map((id) => (
                <div key={id} className={style["carousel__slide"]}>
                  <img
                    src={STATION_ICONS[id]}
                    alt={`Station ${id}`}
                    className={style["carousel__image"]}
                  />
                  <span className={style["carousel__number"]}>{id}</span>
                  <div className={style["carousel__text"]}>
                    <h3 className={style["carousel__slide-title"]}>
                      {t(`station-${id}-title`)}
                    </h3>
                    <p className={style["carousel__slide-subtitle"]}>
                      {t(`station-${id}-subtitle`)}
                    </p>
                    <p className={style["carousel__slide-desc"]}>
                      {t(`station-${id}-desc`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading &&
        !error &&
        mostRecent &&
        mostRecent.fields.companies &&
        mostRecent.fields.companies.length > 0 && (
          <div className={style["featured-networking__companies"]}>
            <h3 className={style["featured-networking__companies-title"]}>
              {t("participating-companies")}
            </h3>
            <div className={style["featured-networking__logos"]}>
              {mostRecent.fields.companies.map(
                (company: any, index: number) => {
                  const imageUrl = company.fields?.image?.fields?.file?.url;
                  return imageUrl ? (
                    <a
                      key={index}
                      href={company.fields?.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={style["featured-networking__logo-link"]}
                    >
                      <img
                        src={`https:${imageUrl}`}
                        alt={company.fields?.name || "Company"}
                        className={style["featured-networking__logo"]}
                      />
                    </a>
                  ) : null;
                },
              )}
            </div>
          </div>
        )}

      {!loading && pastNetworkings.length > 0 && (
        <div
          className={`${style["networking__section"]} ${style["section-2"]}`}
        >
          <h2 className={style["past-networkings__title"]}>
            {t("past-events")}
          </h2>
          <div className={style["past-networkings__list"]}>
            {pastNetworkings.map((networking: any, index: number) => (
              <NetworkingCard key={index} networking={networking} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
