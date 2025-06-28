import React from 'react'

import Link from 'next/link'

import { Box, } from '@material-ui/core'

const Links = ({links, symbol}) => {
  return (
    <>
      {
        links.map((link, i) =>
        <Box key={i} px={1}> 
          <Link href={`/${link.navigateTo}/${symbol}`}>
            <a style={ link.found ? {cursor: 'pointer', textDecoration: 'none', color: '#0069ff'} : {color: '#ACACAC', pointerEvents: 'none', textDecoration: 'none'}}>
              {link.icon}
            </a>
          </Link>
        </Box>
        )
      }
    </>
  )
}

export default Links
