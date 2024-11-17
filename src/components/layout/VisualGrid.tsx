export default function VisualGrid() {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 lg:px-0 px-2 sm:px-4 lg:max-w-[var(--max-width)] h-full flex justify-between mx-auto z-[-1]'>
      <div className='w-[1px] h-full bg-[#f2f2f2]'></div>
      <div className='w-[1px] h-full bg-[#f2f2f2]'></div>
      <div className='w-[1px] h-full bg-[#f2f2f2]'></div>
      <div className='w-[1px] h-full bg-[#f2f2f2]'></div>
      <div className='w-[1px] h-full bg-[#f2f2f2] sm:block hidden'></div>
    </div>
  );
}
