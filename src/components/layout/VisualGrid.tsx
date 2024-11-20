export default function VisualGrid() {
  return (
    <div className='fixed inset-0 px-2 sm:px-4 sm:max-w-[var(--max-width)] h-full flex justify-between mx-auto z-[-1]'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={`w-[1px] h-full bg-grid ${index === 4 ? 'sm:block hidden' : ''}`}></div>
        ))}
    </div>
  );
}
