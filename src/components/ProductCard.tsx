"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  product: Product;
  className?: string;
};

const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(
    Math.round(n)
  );

const calcDiscount = (
  price?: number,
  originalPrice?: number,
  existing?: number
): number | undefined => {
  if (typeof existing === "number" && isFinite(existing)) return existing;
  if (
    typeof price === "number" &&
    typeof originalPrice === "number" &&
    isFinite(price) &&
    isFinite(originalPrice) &&
    originalPrice > 0
  ) {
    const pct = Math.max(0, Math.min(100, ((originalPrice - price) / originalPrice) * 100));
    return Math.round(pct);
  }
  return undefined;
};

export default function ProductCard({ product, className = "" }: Props) {
  const { isAuthenticated } = useAuth();
  const discount = useMemo(
    () => calcDiscount(product.price, product.originalPrice, (product as any).discountPercent),
    [product]
  );

  // Truncate description to 2 lines similar to reference UI
  const description = product.description || "";

  const handleWishlistClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.dispatchEvent(new CustomEvent('auth:open', { detail: { mode: 'login' } }));
      return;
    }
    // If authenticated, navigate to wishlist page for now
    window.location.href = '/wishlist';
  };

  return (
    <Link href={`/product/${product.id}`} className={`group block ${className}`}> 
      <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Image */}
        <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
          <Image
            src={product.images?.[0] || "/images/placeholder.jpg"}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority={false}
          />

          {/* Left top badge (rating) */}
          <div className="absolute left-3 bottom-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow">
            <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118L10.5 13.348a1 1 0 00-1.175 0l-2.944 2.125c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.746 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.303-3.292z" />
            </svg>
            <span className="text-xs font-semibold text-gray-900">{product.rating?.toFixed(1) ?? "4.2"}</span>
          </div>

          {/* Wishlist button top-right */}
          <button
            aria-label="Add to wishlist"
            title="Wishlist"
            onClick={handleWishlistClick}
            className="absolute right-2 top-2 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 shadow flex items-center justify-center hover:bg-white"
          >
            <svg className="w-5 h-5 text-gray-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate" title={product.name}>
            {product.name}
          </h3>
          <p
            className="mt-1 text-xs text-gray-600 line-clamp-2"
            style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
            title={description}
          >
            {description}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm md:text-base font-bold text-gray-900">₹{formatPrice(product.price)}</span>
            {typeof product.originalPrice === "number" && (
              <span className="text-xs md:text-sm text-red-500 line-through">₹{formatPrice(product.originalPrice)}</span>
            )}
            {typeof discount === "number" && discount > 0 && (
              <span className="text-[10px] md:text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                {discount}% OFF
              </span>
            )}
          </div>
          {typeof product.originalPrice === "number" && product.originalPrice > product.price && (
            <div className="mt-1 text-[11px] md:text-xs text-green-700">
              You save ₹{formatPrice((product.originalPrice - product.price))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
