"use client";

import { useEffect, useRef, useState } from "react";
import { useExperience } from "./ExperienceContext";

type Iss = { latitude: number; longitude: number; altitude: number; velocity: number; visibility: string };
type Epic = { image: string; date: string; caption: string; centroid_coordinates: { lat: number; lon: number } };
type Apod = { title: string; date: string; explanation: string; url: string; media_type: string; copyright?: string; thumbnail_url?: string };

const NASA_KEY = "DEMO_KEY"; // NASA's public demo key: rate limited per visitor, fine for a page like this

async function getJson<T>(urls: string[]): Promise<T> {
  let last: unknown;
  for (const u of urls) {
    try {
      const r = await fetch(u, { cache: "no-store" });
      if (r.ok) return (await r.json()) as T;
      last = new Error(String(r.status));
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

const fmt = (n: number, d = 0) => n.toLocaleString("en-GB", { maximumFractionDigits: d, minimumFractionDigits: d });
const deg = (v: number, pos: string, neg: string) => `${fmt(Math.abs(v), 1)}° ${v >= 0 ? pos : neg}`;

function epicUrl(e: Epic) {
  const [d] = e.date.split(" ");
  const [y, m, day] = d.split("-");
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${day}/jpg/${e.image}.jpg`;
}

/**
 * Live data from public NASA and community APIs, fetched in the visitor's
 * browser. Each panel says where its data comes from and degrades to a link
 * if the service cannot be reached.
 */
export function LiveNow() {
  const { media } = useExperience();
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [iss, setIss] = useState<Iss | null>(null);
  const [issErr, setIssErr] = useState(false);
  const trail = useRef<{ lat: number; lon: number }[]>([]);
  const [epic, setEpic] = useState<Epic | null>(null);
  const [epicErr, setEpicErr] = useState(false);
  const [apod, setApod] = useState<Apod | null>(null);
  const [apodErr, setApodErr] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setNear(true);
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    getJson<Epic[]>(["https://epic.gsfc.nasa.gov/api/natural", `https://api.nasa.gov/EPIC/api/natural?api_key=${NASA_KEY}`])
      .then((list) => (list.length ? setEpic(list[Math.floor(list.length / 2)]) : setEpicErr(true)))
      .catch(() => setEpicErr(true));
    getJson<Apod>([`https://api.nasa.gov/planetary/apod?api_key=${NASA_KEY}&thumbs=true`])
      .then(setApod)
      .catch(() => setApodErr(true));
  }, [near]);

  useEffect(() => {
    if (!visible) return;
    let alive = true;
    const tick = () =>
      getJson<Iss>(["https://api.wheretheiss.at/v1/satellites/25544"])
        .then((d) => {
          if (!alive) return;
          trail.current = [...trail.current.slice(-40), { lat: d.latitude, lon: d.longitude }];
          setIss(d);
          setIssErr(false);
        })
        .catch(() => alive && setIssErr(true));
    void tick();
    const id = setInterval(tick, 5000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [visible]);

  const map = media["world-map"];
  const pos = (lat: number, lon: number) => ({ left: `${((lon + 180) / 360) * 100}%`, top: `${((90 - lat) / 180) * 100}%` });

  return (
    <section ref={ref} className="live" aria-labelledby="live-title">
      <div className="live-inner">
        <p className="scene-eyebrow">Right now</p>
        <h2 id="live-title" className="scene-title">
          Above you, today
        </h2>
        <p className="live-intro">Live data, fetched as you read this. Nothing here is a simulation.</p>

        <div className="live-grid">
          <article className="live-card live-iss" aria-labelledby="live-iss-title">
            <h3 id="live-iss-title">The International Space Station</h3>
            <div className="live-map" role="img" aria-label={iss ? `World map with the space station over ${deg(iss.latitude, "N", "S")}, ${deg(iss.longitude, "E", "W")}` : "World map"}>
              {map ? (
                // eslint-disable-next-line @next/next/no-img-element -- remote NASA Blue Marble map from Wikimedia
                <img src={map.srcSmall} alt="" loading="lazy" decoding="async" onError={(e) => (e.currentTarget.style.display = "none")} />
              ) : null}
              {trail.current.slice(0, -1).map((p, i) => (
                <span key={i} className="live-trail" style={pos(p.lat, p.lon)} />
              ))}
              {iss ? <span className="live-dot" style={pos(iss.latitude, iss.longitude)} /> : null}
            </div>
            {iss ? (
              <dl className="live-stats" aria-live="off">
                <div>
                  <dt>Over</dt>
                  <dd>
                    {deg(iss.latitude, "N", "S")}, {deg(iss.longitude, "E", "W")}
                  </dd>
                </div>
                <div>
                  <dt>Height</dt>
                  <dd>{fmt(iss.altitude)} km</dd>
                </div>
                <div>
                  <dt>Speed</dt>
                  <dd>{fmt(iss.velocity)} km/h</dd>
                </div>
                <div>
                  <dt>Side of Earth</dt>
                  <dd>{iss.visibility === "eclipsed" ? "Night" : "Day"}</dd>
                </div>
              </dl>
            ) : (
              <p className="live-wait">{issErr ? "The tracking service did not answer. Try again in a moment." : "Finding the station…"}</p>
            )}
            <p className="live-src">
              Position updates every 5 seconds from{" "}
              <a href="https://wheretheiss.at/" target="_blank" rel="noopener noreferrer">
                Where the ISS at?<span className="sr-only"> (opens in a new tab)</span>
              </a>
              . Map: NASA Blue Marble.
            </p>
          </article>

          <article className="live-card" aria-labelledby="live-epic-title">
            <h3 id="live-epic-title">The whole Earth, photographed this week</h3>
            {epic ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- remote NASA EPIC image */}
                <img className="live-photo round" onError={(e) => (e.currentTarget.style.visibility = "hidden")} src={epicUrl(epic)} alt={`The sunlit side of Earth photographed by NASA's EPIC camera on ${epic.date.split(" ")[0]}, centred near ${deg(epic.centroid_coordinates.lat, "N", "S")}, ${deg(epic.centroid_coordinates.lon, "E", "W")}`} loading="lazy" decoding="async" />
                <p className="live-cap">
                  Real photo, {new Date(epic.date.replace(" ", "T") + "Z").toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC. Taken by NASA&apos;s EPIC camera on the NOAA DSCOVR spacecraft, about 1.5 million km from Earth.
                </p>
              </>
            ) : (
              <p className="live-wait">{epicErr ? "NASA's EPIC service did not answer right now." : "Fetching today's Earth…"}</p>
            )}
            <p className="live-src">
              <a href="https://epic.gsfc.nasa.gov/" target="_blank" rel="noopener noreferrer">
                NASA EPIC<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          </article>

          <article className="live-card" aria-labelledby="live-apod-title">
            <h3 id="live-apod-title">NASA&apos;s Astronomy Picture of the Day</h3>
            {apod ? (
              <>
                {apod.media_type === "image" || apod.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote NASA APOD image
                  <img className="live-photo" onError={(e) => (e.currentTarget.style.visibility = "hidden")} src={apod.media_type === "image" ? apod.url : apod.thumbnail_url} alt={apod.title} loading="lazy" decoding="async" />
                ) : null}
                <p className="live-cap">
                  <strong>{apod.title}</strong> · {apod.date}
                  {apod.copyright ? ` · © ${apod.copyright.trim()}` : ""}
                </p>
                <p className="live-cap muted">{apod.explanation.length > 240 ? apod.explanation.slice(0, 240).replace(/\s+\S*$/, "") + "…" : apod.explanation}</p>
                <p className="live-src">
                  Chosen and explained each day by professional astronomers. Sometimes it is an illustration; the caption says so.{" "}
                  <a href={`https://apod.nasa.gov/apod/ap${apod.date.slice(2).replace(/-/g, "")}.html`} target="_blank" rel="noopener noreferrer">
                    Read it at NASA<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </p>
              </>
            ) : (
              <p className="live-wait">
                {apodErr ? (
                  <>
                    NASA&apos;s picture service is busy.{" "}
                    <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank" rel="noopener noreferrer">
                      See today&apos;s picture at NASA<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </>
                ) : (
                  "Fetching today's picture…"
                )}
              </p>
            )}
          </article>
        </div>
        <p className="live-note">ISRO does not publish a live public data feed, so its latest work appears in the chapter above: Chandrayaan-3 on the Moon.</p>
      </div>
    </section>
  );
}
