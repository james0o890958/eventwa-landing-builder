import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { categories, mockEvents } from "@/data/mockEvents";

const CategoryBrowser = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
          Browse by Category
        </h2>
        <p className="mb-8 text-sm text-muted-foreground sm:mb-10 sm:text-base">
          Find events that match your interests
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {categories.map((cat, i) => {
            const count = mockEvents.filter(
              (e) => e.category === cat.id,
            ).length;
            return (
              <Link key={cat.id} to={`/category/${cat.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="group flex flex-col items-center gap-2.5 rounded-2xl border border-border/50 bg-card p-3.5 sm:p-5 transition-colors hover:border-primary/30"
                >
                  <div
                    className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${cat.color} text-xl sm:text-2xl shadow-lg transition-transform group-hover:scale-110`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center truncate max-w-full">
                    {cat.label}
                  </span>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">
                    {count} event{count !== 1 ? "s" : ""}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryBrowser;
