export default function VisualGrid() {
  return (
    <div className='fixed inset-0 lg:px-0 px-2 sm:px-4 lg:max-w-[var(--max-width)] h-full flex justify-between mx-auto z-[-1]'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className={`w-[1px] h-full bg-[#f2f2f2] ${index === 4 ? 'sm:block hidden' : ''}`}></div>
        ))}
    </div>
  );
}