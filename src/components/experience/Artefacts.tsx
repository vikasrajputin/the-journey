"use client";

import { useRef, useState } from "react";
import type { Artefact } from "./scene-data";

/**
 * "Hold it in 3D": real specimens scanned by the Smithsonian. The viewer is
 * an iframe from 3d.si.edu, loaded only after the visitor picks a specimen.
 */
export function Artefacts({ items, sceneId }: { items: Artefact[]; sceneId: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [pick, setPick] = useState<Artefact | null>(null);
  const close = () => {
    dialog.current?.close();
    setPick(null);
  };
  return (
    <>
      <button type="button" className="scene-proof scene-3d" onClick={() => dialog.current?.showModal()}>
        <span aria-hidden="true">◎</span> Turn it in 3D
      </button>
      <dialog ref={dialog} className="proof artefacts" aria-labelledby={`${sceneId}-3d-title`} onClose={() => setPick(null)} onClick={(e) => e.target === e.currentTarget && close()}>
        <div className="proof-inner">
          <div className="proof-head">
            <div>
              <p className="scene-eyebrow">Smithsonian 3D scans</p>
              <h3 id={`${sceneId}-3d-title`} className="proof-title">
                {pick ? pick.title : "Hold it in your hands"}
              </h3>
            </div>
            <button type="button" className="proof-close" onClick={close}>
              Close
            </button>
          </div>
          {pick ? (
            <>
              <div className="artefact-frame">
                <iframe src={pick.embed} title={`3D model: ${pick.title}`} allow="fullscreen; xr-spatial-tracking" allowFullScreen loading="lazy" />
              </div>
              <p className="proof-intro">
                {pick.text} Drag to turn it, pinch or scroll to zoom. <span className="text-muted">{pick.credit}.</span>
              </p>
              <div className="proof-foot">
                <button type="button" className="scene-action-inline ghost" onClick={() => setPick(null)}>
                  Back to the list
                </button>
                <a className="scene-action-inline" href={pick.page} target="_blank" rel="noopener noreferrer">
                  Open at the Smithsonian<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </>
          ) : (
            <>
              <p className="proof-intro">3D scans made by the Smithsonian Institution. The 3D viewer loads from the Smithsonian when you pick one.</p>
              <ul className="artefact-list">
                {items.map((a) => (
                  <li key={a.id}>
                    <button type="button" onClick={() => setPick(a)}>
                      <strong>{a.title}</strong>
                      <span>{a.text}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
