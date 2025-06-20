'use client'
import React from 'react'
import { Card, CardContent } from '../ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
import Image from 'next/image'
import useGeneratedStore from '@/hooks/useGeneratedStore'

const GeneratedImages = () => {

    const images = useGeneratedStore((state) => state.images);

    if(images.length === 0){
        return <Card className='w-full max-w-2xl bg-muted'>
            <CardContent className='flex aspect-square items-center justify-center p-6'>
                <span className='text-2xl'>No images generated</span>
            </CardContent>
        </Card>
    }

  return (
    <Carousel
      
      className="w-full max-w-2xl"
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index} >
            <div className="flex relative items-center justify-center rounded-lg overflow-hidden aspect-square">
              <Image src={image.url} alt={'Generated Images using AI'} fill sizes="(max-width: 768px) 100vw, 512px" className='w-full h-full object-cover' />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default GeneratedImages