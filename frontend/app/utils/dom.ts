import { useEffect, useState } from 'react'

function getWindowDimensions() {
    if ((typeof window) === 'undefined') {
      return { width: 0, height: 0 };
    }
    const { innerWidth: width, innerHeight: height } = window || {};
    return {
      width,
      height
    };
  }
  
  export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
      if (window) {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);  
      }
    }, []);
  
    return windowDimensions;
  }
  