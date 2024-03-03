"use client"

import { FC, useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { useCart } from "@/hooks/use-cart"
import { Product } from "@/payload-types"
import { toast } from "sonner"

interface AddToCartButtonProps {
  product: Product
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ product }) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const { addItem, items } = useCart()

  const existingCartItem = items.find((item) => item.product.id === product.id)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [isSuccess])

  return (
    <Button
      onClick={() => {
        setIsSuccess(true)
        if (existingCartItem) {
          toast.info("Product already in cart")
          return
        } else {
          addItem(product)
        }
      }}
      size={"lg"}
      className="w-full"
    >
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  )
}

export default AddToCartButton
