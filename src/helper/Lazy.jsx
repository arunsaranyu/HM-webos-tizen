import React, { Suspense } from 'react'
import Loader from './Loader.jsx'

const LazyWrapper = (props) => {
    return (
      

            <Suspense fallback={<Loader />}>
                {props.children}
            </Suspense>
        
    )
}

export default LazyWrapper