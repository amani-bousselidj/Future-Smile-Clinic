"use client";

import { motion } from "framer-motion";
import { FaTooth } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block text-primary-light text-6xl mb-4"
        >
          <FaTooth />
        </motion.div>

        <h2 className="text-2xl font-bold text-primary-dark mb-2">
          جاري التحميل...
        </h2>

        <div className="flex gap-2 justify-center mt-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            className="w-3 h-3 bg-primary-light rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            className="w-3 h-3 bg-primary-light rounded-full"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            className="w-3 h-3 bg-primary-light rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
