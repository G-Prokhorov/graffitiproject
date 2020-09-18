
import React, { useState, useEffect } from 'react'
import { useTransition, animated, config } from 'react-spring'

const slides = [
  { id: 0, url: 'https://graffitiproject.s3.eu-north-1.amazonaws.com/graffiti-1080x530.jpg' },
  { id: 1, url: 'https://images.unsplash.com/photo-1544572571-ab94fd872ce4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1534&q=80&auto=format&fit=crop' },
  { id: 2, url: 'https://graffitiproject.s3.eu-north-1.amazonaws.com/graffiti-1080x530.jpg' },
  { id: 3, url: 'https://images.unsplash.com/photo-1544572571-ab94fd872ce4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1534&q=80&auto=format&fit=crop' },
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

export  default Gallery;