import React from "react";
import { motion } from "framer-motion";

const EventCardSkeleton = ({ index = 0 }: { index?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="rounded-2xl border border-border/50 bg-card shadow-card animate-pulse"
    >
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card">
        <div className="relative aspect-[16/10] bg-gray-200" />
        <div className="p-4 space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded" />
          <div className="h-4 w-1/2 bg-gray-200 rounded" />
          <div className="flex gap-2 mt-2">
            <div className="h-4 w-4 bg-gray-200 rounded-full" />
            <div className="h-4 w-4 bg-gray-200 rounded-full" />
            <div className="h-4 w-4 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCardSkeleton;
