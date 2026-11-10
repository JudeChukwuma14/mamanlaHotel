import { Loader2 } from "lucide-react";


const SplashScreen = () => {
  return (
    <div className=" fixed inset-0 z-100 flex flex-col items-center justify-center bg-linear-to-br from-[#0c6478] to-[rgb(11,208,199)] text-white">
      <div className="mb-8 animate-pulse text-center">
        <h1 className="text-4xl font-black tracking-tighter sm:text-6xl capitalize drop-shadow-xl">
          Mamanla
        </h1>
        <p className="mt-2 text-lg tracking-wide drop-shadow-md">
          Hotel and Co
        </p>
      </div>

      <div className=" relative flex items-center justify-center">
        <div className=" absolute h-20 w-20 animate-ping rounded-full bg-white/20"></div>
        <Loader2 className="animate-spin h-12 w-12 text-white" />
      </div>
    </div>
  );
};

export default SplashScreen;
