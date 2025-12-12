import React, {  useEffect, useState } from "react";
import { Link, useParams } from "react-router";
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
import UserListButton from "../UserListButton";

const SideBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { brushColor, brushSize, setBrushColor, setBrushSize } = useDrawing();
  const { id: imageId } = useParams<{ id: string }>();
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [alpha, setAlpha] = useState<number>(255);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Update recent colors
      setRecentColors((prevColors) => {
        if (prevColors.includes(brushColor)) {
          // Move to front if already exists
          return [brushColor, ...prevColors.filter((c) => c !== brushColor)];
        } else {
          // Add to front, keep max 5
          const updated = [brushColor, ...prevColors];
          return updated.length > 5 ? updated.slice(0, 5) : updated;
        }
      });
    }, 300); // 300ms is a good debounce for UI interactions

    return () => clearTimeout(timeout);
  }, [brushColor]); // Only brushColor as dependency

  const brushSizes = [1, 2, 4, 6, 8, 12, 16, 24];

  return (
    <div
      className={`overflow-y-scroll fixed left-0 top-0 bottom-0 bg-gray-800 border-r border-gray-600 transition-all duration-300 ease-in-out z-50 ${
        isExpanded ? "w-64" : ""
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
            className={`${isExpanded ? "flex items-center space-x-3" : ""} p-2 rounded-lg bg-gray-700`}
          >
            <FiEdit3 className="w-5 h-5 text-blue-400 shrink-0" />
            {isExpanded && <span className="text-gray-300">Brush Tool</span>}
          </div>

          <div className="space-y-2">
            <div
              className={`flex items-center space-x-3 ${isExpanded ? "" : "justify-center"}`}
            >
              <IoColorPaletteOutline className="w-5 h-5 text-gray-400 shrink-0" />
              {isExpanded && (
                <span className="text-sm text-gray-400">Color</span>
              )}
            </div>

            <div
              className={`p-2 rounded-lg flex items-center hover:bg-gray-700 transition-colors ${isExpanded ? "" : "justify-center"}`}
            >
              <input
                type="color"
                name="stroke-color"
                value={brushColor.slice(0, 7)}
                title={"Current Color: " + brushColor.slice(0, 7)}
                onChange={(e) => {
                  const newColor =
                    e.target.value + alpha.toString(16).padStart(2, "0");
                  setBrushColor(newColor);
                }}
                className="aspect-square w-6 h-6 p-0 rounded border-2 border-gray-600 cursor-pointer bg-transparent"
              />
            </div>
            {isExpanded && recentColors.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Recent Colors:</span>
                <div className="flex space-x-2 mt-1">
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className="w-6 h-6 rounded border-2 border-gray-600 p-0"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            {isExpanded && (
              <div className="mt-2">
                <label>Alpha</label>
                <div className="">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={alpha}
                    onChange={(e) => {
                      const newAlpha = parseInt(e.target.value);
                      setAlpha(newAlpha);
                      setBrushColor(
                        brushColor.slice(0, 7) +
                          newAlpha.toString(16).padStart(2, "0"),
                      );
                    }}
                    className=""
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div
              className={`flex items-center space-x-3 ${isExpanded ? "" : "justify-center"}`}
            >
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
          {imageId && (
            <UserListButton imageId={imageId} sidebar isExpanded={isExpanded} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
