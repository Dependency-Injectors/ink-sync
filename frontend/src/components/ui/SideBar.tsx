import React, { useState } from "react";
import { Link } from "react-router";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiEdit3,
  FiSliders,
} from "react-icons/fi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { useDrawing } from "../../hooks/useDrawing";
import { IoIosImages } from "react-icons/io";

const SideBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { brushColor, brushSize, setBrushColor, setBrushSize } = useDrawing();

  const brushSizes = [1, 2, 4, 6, 8, 12, 16, 24];

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 bg-gray-800 border-r border-gray-600 transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? "w-64" : "w-18"
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-6 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1 border border-gray-600 transition-colors"
      >
        {isExpanded ? (
          <FiChevronLeft className="w-4 h-4" />
        ) : (
          <FiChevronRight className="w-4 h-4" />
        )}
      </button>

      <div className="p-4 space-y-6">
        <div className="space-y-2">
          {isExpanded && (
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Navigation
            </h3>
          )}

          <Link
            to="/"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            <FiHome className="w-5 h-5 shrink-0" />
            {isExpanded && <span>Home</span>}
          </Link>
          <Link
            to="/images"
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            <IoIosImages className="w-5 h-5 shrink-0" />
            {isExpanded && <span>Images</span>}
          </Link>
        </div>

        <div className="space-y-4">
          {isExpanded && (
            <h3 className="text-sm font-medium text-gray-300 mb-3">
              Drawing Tools
            </h3>
          )}

          <div
            className={`${isExpanded ? "flex items-center" : ""} space-x-3 p-2 rounded-lg bg-gray-700`}
          >
            <FiEdit3 className="w-5 h-5 text-blue-400 shrink-0" />
            {isExpanded && <span className="text-gray-300">Brush Tool</span>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <IoColorPaletteOutline className="w-5 h-5 text-gray-400 shrink-0" />
              {isExpanded && (
                <span className="text-sm text-gray-400">Color</span>
              )}
            </div>

            <div className="space-y-2">
              <div className="">
                <input
                  type="color"
                  name=""
                  id=""
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="aspect-square w-6 h-6 p-0 rounded border-2 border-gray-600 cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <FiSliders className="w-5 h-5 text-gray-400 shrink-0" />
              {isExpanded && (
                <span className="text-sm text-gray-400">Size</span>
              )}
            </div>

            {isExpanded && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Current: {brushSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {brushSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        brushSize === size
                          ? "bg-blue-600 border-blue-400 text-white"
                          : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default SideBar;
