export default function VisualGrid() {
  return (
    <div className='fixed inset-0 z-[-1] mx-auto flex h-full justify-between px-2 sm:max-w-[var(--max-width)] sm:px-4'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div
            key={index}
            className={`h-full w-[1px] bg-grid ${index === 4 ? 'hidden sm:block' : ''}`}
          ></div>
        ))}
    </div>
  );
}
