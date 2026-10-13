import React from 'react';
import { LoaderIcon } from "lucide-react";

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="w-12 h-12 text-blue-500 animate-spin" />
      
    </div>
  )
}

export default PageLoader;