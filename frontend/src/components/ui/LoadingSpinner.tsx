export default function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 border-4 border-ocean/20 border-t-ocean rounded-full animate-spin" />
      <p className="font-display text-ocean text-sm">{message}</p>
    </div>
  )
}