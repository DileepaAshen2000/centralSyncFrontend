
import React from 'react'

const Button = (props) => {
  return (
    <button style={{backgroundColor:'#007EF2'}} className='px-6 py-2 text-white rounded'>
      {props.children}
    </button>
  )
}

export default Button
