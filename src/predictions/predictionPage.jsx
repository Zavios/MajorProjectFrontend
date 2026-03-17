import React from "react";
import { Pencil, PencilIcon } from "lucide-react";

function PredictionPage(content) {
  return (
    <div>
      <div>
        <span className="text-2xl font-bold">Title</span>
      </div>

      <div className="p-3 border border-neutral-700 rounded-lg text-justify">
        <span>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Inventore
          sit delectus quasi obcaecati soluta eligendi unde maiores nemo
          doloremque rem natus, facere temporibus amet, optio corrupti aut
          veniam, odit minus quam fuga magnam. Blanditiis dolorem, autem sunt
          eum, nesciunt delectus modi officiis velit, nemo reiciendis impedit
          assumenda rerum optio beatae.
        </span>

        <div className="flex justify-end">
          <button className="cursor-pointer">
            <PencilIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export default PredictionPage;
