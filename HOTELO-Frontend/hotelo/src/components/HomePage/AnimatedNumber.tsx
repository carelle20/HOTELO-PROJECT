import { motion } from "framer-motion";
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import One from "../components/assets/number-1.lottie";
import Two from "../components/assets/Jiggly-2.lottie";
import Three from "../components/assets/Jiggly-3.lottie";

type Props = {
  n: number;
};

export default function AnimatedNumber({ n }: Props) {
  // If you add more number Lottie files (number 2.lottie, ...)
  // you can extend this mapping to render them here.
  if (n === 1) {
    return (
      <div className="w-9 h-9 flex items-center justify-center">
        <DotLottieReact src={One} loop autoplay style={{ width: 36, height: 36 }} />
      </div>
    );
  }
  if (n === 2) {
    return (
      <div className="w-9 h-9 flex items-center justify-center">
        <DotLottieReact src={Two} loop autoplay style={{ width: 36, height: 36 }} />
      </div>
    );
  }
  if (n === 3) {
    return (
      <div className="w-9 h-9 flex items-center justify-center">
        <DotLottieReact src={Three} loop autoplay style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <motion.div
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="w-9 h-9 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-bold text-sm"
    >
      {`0${n}`}
    </motion.div>
  );
}
