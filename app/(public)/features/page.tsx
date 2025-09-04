import Hero from '@/components/Features/hero'
import React from 'react'
import Header from '@/components/Header'
import Damage from '@/components/Features/damage'
import Service from '@/components/Features/service'
import Ownership from '@/components/Features/ownership'
import Sample from '@/components/Features/sample'
import WhyItMatters from '@/components/Features/why-it-matters'
import { Footer } from '@/components/Footer'

const page = () => {
  return (
    <div>

        <Hero />
        <Damage />
        <Service />
        <Ownership />
        <Sample />
        <WhyItMatters />
        
  
    </div>
  )
}

export default page