"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

function isVideo(src: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(src.split("?")[0]);
}

export default function ProjectGallery({ title, images }: {
  title: string;
  images: string[];
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement>(null);
  const imageItems = images.filter(src => !isVideo(src));
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog?.showModal();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const step = event.key === "ArrowRight" ? 1 : -1;
        setActiveIndex(index => index === null ? null : (index + step + imageItems.length) % imageItems.length);
      }
    };
    dialog?.addEventListener("keydown", onKeyDown);

    return () => {
      dialog?.removeEventListener("keydown", onKeyDown);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen, imageItems.length]);

  return <>
    <div className="project-gallery-list">
      {images.map((media, index) => <figure key={media} className="project-media-item">
        {isVideo(media) ? <>
          <video className="project-media" src={media} controls playsInline preload="metadata" aria-label={`${title} — video ${index + 1}`} />
          <figcaption className="sr-only">{title} — project video {index + 1}</figcaption>
        </> : <button
          type="button"
          className="project-media-button"
          onClick={event => {
            returnFocusRef.current = event.currentTarget;
            setActiveIndex(imageItems.indexOf(media));
          }}
          aria-label={`View ${title} image ${index + 1} full size`}
        ><Image
          src={media}
          alt={`${title} — design detail ${index + 1}`}
          width={2000}
          height={2000}
          unoptimized={/\.gif$/i.test(media)}
          sizes="(max-width: 920px) calc(100vw - 40px), 1180px"
          className="project-media"
        /></button>}
      </figure>)}
    </div>

    {activeIndex !== null && <dialog
      ref={dialogRef}
      className="lightbox"
      aria-label={`${title} image viewer`}
      onCancel={event => { event.preventDefault(); setActiveIndex(null); }}
      onClick={event => { if (event.target === event.currentTarget) setActiveIndex(null); }}
    >
      <button type="button" className="lightbox-close" onClick={() => setActiveIndex(null)} aria-label="Close image viewer" autoFocus>×</button>
      {imageItems.length > 1 && <button type="button" className="lightbox-previous" aria-label="Previous image" onClick={() => setActiveIndex((activeIndex - 1 + imageItems.length) % imageItems.length)}>←</button>}
      {/* A native image retains the original artwork resolution in the viewer. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageItems[activeIndex]} alt={`${title} — image ${activeIndex + 1}`} className="lightbox-image" />
      {imageItems.length > 1 && <button type="button" className="lightbox-next" aria-label="Next image" onClick={() => setActiveIndex((activeIndex + 1) % imageItems.length)}>→</button>}
      <p className="lightbox-count" aria-live="polite">{activeIndex + 1} / {imageItems.length}</p>
    </dialog>}
  </>;
}
