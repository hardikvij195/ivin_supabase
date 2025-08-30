import React from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Blog/hero'
import Newsroom from '@/components/Blog/newsroom'
import { Footer } from '@/components/Footer'

const page = () => {
  return (
    <div>
          <Header />
        <Hero />
        <Newsroom />
        <Footer/>
    

    </div>
  )
}

export default page