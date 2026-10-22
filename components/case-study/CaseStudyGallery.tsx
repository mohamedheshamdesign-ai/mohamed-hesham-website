"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import {
  groupMediaByRhythm,
  type MediaGroup,
} from "@/lib/case-study";
import type {
  ProjectMedia,
  ResolvedChapter,
} from "@/lib/projects";

type CaseStudyGalleryProps = {
  title: string;
  chapters: ResolvedChapter[];
};

function sizesFor(layout: MediaGroup["layout"]) {
  switch (layout) {
    case "full":
      return "100vw";
    case "duo":
      return "(max-width: 700px) 100vw, 50vw";
    case "wide":
      return "(max-width: 900px) 100vw, 1100px";
    default:
      return "(max-width: 900px) 100vw, 760px";
  }
}


function isVideo(src: string) {
  return /\.(mp4|webm|mov|m4v)$/i.test(
    src.split("?")[0]
  );
}

/**
 * The case study gallery.
 *
 * Media is grouped into a varied rhythm — full-bleed moments, pairs and
 * offset details — so a case study reads as an edited sequence rather
 * than a stack of identical frames. Every image can be opened in an
 * accessible lightbox.
 */
export default function CaseStudyGallery({
  title,
  chapters,
}: CaseStudyGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    null
  );
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement>(null);

  const images = chapters.flatMap((chapter) =>
    chapter.media.filter((item) => !isVideo(item.src))
  );

  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;

    dialog?.showModal();
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowLeft"
      ) {
        event.preventDefault();

        const step =
          event.key === "ArrowRight" ? 1 : -1;

        setActiveIndex((index) =>
          index === null
            ? null
            : (index + step + images.length) % images.length
        );
      }
    };

    dialog?.addEventListener("keydown", onKeyDown);

    return () => {
      dialog?.removeEventListener("keydown", onKeyDown);
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [isOpen, images.length]);

  return (
    <>
      <div className="cs-gallery">
        {chapters.map((chapter) => {
          const groups = groupMediaByRhythm(
            chapter.media
          );

          return (
            <section
              key={chapter.title}
              className="cs-chapter"
              aria-labelledby={`chapter-${chapter.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")}`}
            >
              <header className="cs-chapter-head">
                <h3
                  id={`chapter-${chapter.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`}
                >
                  {chapter.title}
                </h3>

                {chapter.note && (
                  <p>{chapter.note}</p>
                )}
              </header>

              {groups.map((group, groupIndex) => (
                <div
                  key={`${chapter.title}-${groupIndex}`}
                  className={`cs-group cs-group-${group.layout}`}
                >
                  {group.media.map((item, itemIndex) => (
                    <MediaFigure
                      key={item.src}
                      title={title}
                      chapter={chapter.title}
                      media={item}
                      index={
                        images.findIndex(
                          (image) =>
                            image.src === item.src
                        ) + 1
                      }
                      total={images.length}
                      layout={group.layout}
                      isFirstOfChapter={
                        groupIndex === 0 &&
                        itemIndex === 0
                      }
                      onOpen={(
                        element
                      ) => {
                        returnFocusRef.current = element;
                        setActiveIndex(
                          images.findIndex(
                            (image) =>
                              image.src === item.src
                          )
                        );
                      }}
                    />
                  ))}
                </div>
              ))}
            </section>
          );
        })}
      </div>

      {activeIndex !== null && (
        <dialog
          ref={dialogRef}
          className="lightbox"
          aria-label={`${title} image viewer`}
          onCancel={(event) => {
            event.preventDefault();
            setActiveIndex(null);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveIndex(null);
            }
          }}
        >
          <button
            type="button"
            className="lightbox-close"
            onClick={() => setActiveIndex(null)}
            aria-label="Close image viewer"
            autoFocus
          >
            ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-previous"
              aria-label="Previous image"
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + images.length) %
                    images.length
                )
              }
            >
              ←
            </button>
          )}

          {/* A native image retains the original artwork resolution. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex].src}
            alt={`${title} — image ${activeIndex + 1}`}
            className="lightbox-image"
          />

          {images.length > 1 && (
            <button
              type="button"
              className="lightbox-next"
              aria-label="Next image"
              onClick={() =>
                setActiveIndex(
                  (activeIndex + 1) % images.length
                )
              }
            >
              →
            </button>
          )}

          <p className="lightbox-count" aria-live="polite">
            {activeIndex + 1} / {images.length}
          </p>
        </dialog>
      )}
    </>
  );
}

function MediaFigure({
  title,
  chapter,
  media,
  index,
  total,
  layout,
  isFirstOfChapter,
  onOpen,
}: {
  title: string;
  chapter: string;
  media: ProjectMedia;
  index: number;
  total: number;
  layout: MediaGroup["layout"];
  isFirstOfChapter: boolean;
  onOpen: (element: HTMLButtonElement) => void;
}) {
  const alt = `${title} — ${chapter}, image ${index} of ${total}`;

  if (isVideo(media.src)) {
    return (
      <figure className="cs-media">
        <video
          className="cs-media-video"
          src={media.src}
          controls
          playsInline
          preload="metadata"
          aria-label={alt}
        />
      </figure>
    );
  }

  return (
    <figure className="cs-media">
      <button
        type="button"
        className="cs-media-button"
        onClick={(event) =>
          onOpen(event.currentTarget)
        }
        aria-label={`Open ${alt} full size`}
      >
        <Image
          src={media.src}
          alt={alt}
          width={media.width}
          height={media.height}
          unoptimized={/\.gif$/i.test(media.src)}
          priority={isFirstOfChapter}
          sizes={sizesFor(layout)}
          className="cs-media-image"
        />
      </button>
    </figure>
  );
}
