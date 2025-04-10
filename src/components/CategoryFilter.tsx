
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { categories } from "@/utils/mockData";
import type { ShopCategory } from "@/utils/mockData";

interface CategoryFilterProps {
  onSelect: (category: ShopCategory | null) => void;
  selected: ShopCategory | null;
}

const CategoryFilter = ({ onSelect, selected }: CategoryFilterProps) => {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex space-x-2 min-w-max">
        <Button
          variant={selected === null ? "default" : "outline"}
          className={`rounded-full px-4 ${
            selected === null ? "bg-brand-teal text-white" : ""
          }`}
          onClick={() => onSelect(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selected === category.id ? "default" : "outline"}
            className={`rounded-full px-4 ${
              selected === category.id ? "bg-brand-teal text-white" : ""
            }`}
            onClick={() => onSelect(category.id)}
          >
            <span className="mr-2">{category.icon}</span>
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
