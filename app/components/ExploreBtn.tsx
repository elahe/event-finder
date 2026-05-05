'use client'

import Image from "next/image"

export default function ExploreBtn() {
  return (
    <button type="button" id="explore_btn" className="mt-7 mx-auto" onClick={()=>{console.log("mio")}}>
        <a href="#events">
            Explore events
              <Image src="/icons/arrow-down.svg" alt="arrow down" width={24} height={24} className="w-6 h-6"/>
            
        </a>
    </button>
  )
}
