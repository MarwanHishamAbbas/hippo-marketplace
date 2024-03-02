"use client"

import { Product } from "@/payload-types"
import { FC, useEffect, useState } from "react"
import { Skeleton } from "../ui/Skeleton"
import Link from "next/link"
import { cn, formatPrice } from "@/lib/utils"
import { PRODUCT_CATEGORIES } from "@/config"
import ProductGallery from "./ProductGallery"

interface ProductListingProps {
  product: Product | null
  index: number
}

const ProductListing: FC<ProductListingProps> = ({ product, index }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, index * 75)
    return () => clearTimeout(timer)
  }, [index])

  if (!product || !isVisible) return <ProductPlaceholder />
  const validURLs = product.images
    .map(({ image }) => (typeof image === "string" ? image : image.url))
    .filter(Boolean) as string[]
  if (isVisible && product) {
    const label = PRODUCT_CATEGORIES.find(
      ({ value }) => value === product.category
    )?.label
    return (
      <Link
        href={`/product/${product.id}`}
        className={cn("invisible h-full w-full cursor-pointer", {
          "visible animate-in fade-in-5": isVisible,
        })}
      >
        <div className="flex flex-col w-full">
          <ProductGallery urls={validURLs} />
          <h3 className="mt-4 font-medium text-sm text-gray-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{label}</p>
          <p className="mt-1 font-medium text-sm text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    )
  }
}

export default ProductListing

const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="bg-zinc-100 relative aspect-square w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="mt-4 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  )
}
