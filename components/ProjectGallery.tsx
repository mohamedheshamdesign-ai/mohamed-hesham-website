"use client";

import { useState } from "react";
import Image from "next/image";

import FadeIn from "@/components/FadeIn";

function isVideo(src: string) {
  const clean = src.split("?")[0].toLowerCase();

  return (
    clean.endsWith(".mp4") ||
    clean.endsWith(".webm") ||
    clean.endsWith(".mov") ||
    clean.endsWith(".m4v")
  );
}

function isGif(src: string) {
  return src.split("?")[0].toLowerCase().endsWith(".gif");
}

export default function ProjectGallery({
  title,
  images,
}: {
  title: string;
  images: string[];
}) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <>
      <div className="project-gallery-list">
        {images.map((media) => {
          if (isVideo(media)) {
            return (
              <FadeIn key={media}>
                <figure className="project-media-item">
                  <video
                    className="project-media"
                    src={media}
                    controls
                    playsInline
                    preload="metadata"
                  />
                </figure>
              </FadeIn>
            );
          }

          if (isGif(media)) {
            return (
              <FadeIn key={media}>
                <figure className="project-media-item">
                  <Image
                    src={media}
                    alt={title}
                    width={2000}
                    height={2000}
                    unoptimized
                    className="project-media project-media-gif"
                  />
                </figure>
              </FadeIn>
            );
          }

          return (
            <FadeIn key={media}>
              <figure className="project-media-item">
                <button
                  type="button"
                  className="project-media-button"
                  onClick={() => setLightbox(media)}
                  aria-label={`View ${title} full size`}
                >
                  <Image
                    src={media}
                    alt={`${title} — gallery image`}
                    width={2000}
                    height={2000}
                    sizes="(max-width: 920px) calc(100vw - 48px), 900px"
                    className="project-media"
                  />
                </button>
              </figure>
            </FadeIn>
          );
        })}
      </div>

      {lightbox && (
        <div
          className="lightbox"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            ✕
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox}
            alt={title}
            className="lightbox-image"
          />
        </div>
      )}
    </>
  );
}
