"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Expand, Images } from "lucide-react";
import {
  GALLERY_CATEGORIES,
  GALLERY_IMAGES,
  type GalleryCategory,
  type GalleryImage,
} from "@/lib/gallery-images";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion-presets";

export function FlyerGallery() {
  const reduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "all"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filtered.length);
  }, [lightboxIndex, filtered.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, goPrev, goNext]);

  const activeImage: GalleryImage | null =
    lightboxIndex !== null ? filtered[lightboxIndex] ?? null : null;

  return (
    <>
      {/* Category filters */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {GALLERY_CATEGORIES.map(({ id, label }) => {
          const count =
            id === "all"
              ? GALLERY_IMAGES.length
              : GALLERY_IMAGES.filter((img) => img.category === id).length;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveCategory(id);
                setLightboxIndex(null);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                activeCategory === id
                  ? "bg-green-600 text-white shadow-md"
                  : "border border-border bg-card text-muted-foreground hover:border-green-300 hover:text-green-700"
              )}
            >
              {label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Masonry-style responsive grid — re-animate when category changes */}
      <motion.div
        key={activeCategory}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
        variants={reduceMotion ? undefined : staggerContainer}
        className="columns-1 gap-5 sm:columns-2 lg:columns-3"
      >
        {filtered.map((item, index) => (
          <motion.div key={item.slug} variants={reduceMotion ? undefined : fadeInUp}>
            <GalleryCard item={item} onOpen={() => openLightbox(index)} />
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          <Images className="mx-auto mb-3 h-10 w-10 opacity-40" />
          <p>No images in this category yet.</p>
        </div>
      )}

      {/* Lightbox */}
      {activeImage && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.title}
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] w-full overflow-hidden rounded-xl shadow-2xl">
              <Image
                src={activeImage.src}
                alt={activeImage.title}
                width={activeImage.width}
                height={activeImage.height}
                className="mx-auto max-h-[75vh] w-auto object-contain"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority
              />
            </div>
            <div className="mt-4 max-w-2xl text-center">
              <p className="text-lg font-bold text-white">{activeImage.title}</p>
              <p className="mt-1 text-sm text-white/70">{activeImage.description}</p>
              <p className="mt-2 text-xs text-white/50">
                {lightboxIndex + 1} of {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function GalleryCard({ item, onOpen }: { item: GalleryImage; onOpen: () => void }) {
  const categoryLabel =
    GALLERY_CATEGORIES.find((c) => c.id === item.category)?.label ?? "Creative";

  return (
    <article className="mb-5 break-inside-avoid">
      <button
        type="button"
        onClick={onOpen}
        className="group relative w-full overflow-hidden rounded-2xl border border-border bg-card text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-card-hover focus:outline-none focus:ring-2 focus:ring-green-500/40"
      >
        <div className="relative w-full overflow-hidden bg-green-50/50">
          <Image
            src={item.src}
            alt={item.title}
            width={item.width}
            height={item.height}
            className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
            <span className="mb-2 inline-block rounded-full bg-green-600/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              {categoryLabel}
            </span>
            <h3 className="text-sm font-bold leading-snug text-white sm:text-base">
              {item.title}
            </h3>
          </div>
          <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-green-700 opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            <Expand className="h-4 w-4" />
          </div>
        </div>
      </button>
    </article>
  );
}
