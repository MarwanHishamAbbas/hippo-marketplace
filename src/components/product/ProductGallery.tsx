import { FC } from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel"
import Image from "next/image"
interface ProductGalleryProps {
  urls: string[]
}

const ProductGallery: FC<ProductGalleryProps> = ({ urls }) => {
  return (
    <Carousel className="w-full h-full rounded-lg overflow-hidden">
      <CarouselContent className="aspect-square ">
        {urls.map((url, idx) => (
          <CarouselItem key={idx}>
            <Image
              fill
              loading="eager"
              alt="Product Image"
              className="object-center object-cover w-full"
              src={url}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default ProductGallery
