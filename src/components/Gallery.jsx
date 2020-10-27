import React, { useState, useEffect } from 'react'
import { useTransition, animated, config } from 'react-spring'

const slides = [
  { id: 0, url: 'https://stoneforest.ru/wp-content/uploads/2019/01/Frost-graffiti.jpg' },
  { id: 1, url: 'https://cdn.britannica.com/13/175913-050-3157AC96/Graffiti-New-York-City-1986.jpg' },
  { id: 2, url: 'https://ik.imagekit.io/grgdihc3l/Miami/media/Attractions/Museum_of_Graffiti/Wynwood_Museum_of_Graffiti_sonic_1982_1440x900.jpg?ext=.jpg' },
  { id: 3, url: 'https://cdn.britannica.com/93/171293-050-D99BEDB2/Graffiti-Berlin-Wall.jpg' },
]

const Gallery = () => {
  const [index, set] = useState(0)
  const transitions = useTransition(slides[index], item => item.id, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: config.molasses,
  })
  useEffect(() => void setInterval(() => set(state => (state + 1) % 4), 2000), [])
  return transitions.map(({ item, props, key }) => (
    <animated.div
      key={key}
      class="bg"
      style={{ ...props, backgroundImage: `url(${item.url})` }}
    />
  ))
}

export default Gallery;