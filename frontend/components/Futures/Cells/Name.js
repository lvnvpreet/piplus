import React from 'react'

import Link from 'next/link'

const Name = ({value}) => {
  return (
    <Link href={`futures/${value}`}>
      <a style={{textDecoration: 'none', color: '#000'}}>
      {value}
      </a>
    </Link>
  )
}

export default Name
