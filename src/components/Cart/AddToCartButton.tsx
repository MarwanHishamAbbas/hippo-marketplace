"use client"

import { FC, useEffect, useState } from "react"
import { Button } from "../ui/Button"

interface AddToCartButtonProps {}

const AddToCartButton: FC<AddToCartButtonProps> = ({}) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [isSuccess])
  return (
    <Button onClick={() => setIsSuccess(true)} size={"lg"} className="w-full">
      {isSuccess ? "Added!" : "Add to cart"}
    </Button>
  )
}

export default AddToCartButton
