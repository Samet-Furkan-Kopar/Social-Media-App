import { LoaderCircle } from 'lucide-react'

const Loading = () => {
  return (
     <div className="fixed inset-0 flex items-center justify-center z-50">
        <LoaderCircle className="animate-spin w-8 h-8 text-purple-500" />
      </div>
  )
}

export default Loading
