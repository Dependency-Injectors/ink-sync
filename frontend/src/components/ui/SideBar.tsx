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
  const { brushColor, brushSize, setBrushColor, setBrushSize, currentTool, setCurrentTool } = useDrawing();
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
      className={`overflow-y-auto overflow-x-hidden fixed left-0 top-0 bottom-0 bg-gray-800 border-r border-gray-600 transition-all duration-300 ease-in-out z-50 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500 ${
        isExpanded ? "w-64" : ""
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-1 top-6 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1 border border-gray-600 transition-colors"
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

          {/* Tools as thumbnail grid */}
          {isExpanded ? (
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentTool('brush')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  currentTool === 'brush' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Brush"
              >
                <FiEdit3 className="w-6 h-6 text-blue-400 mb-1" />
                <span className="text-xs text-gray-300">Brush</span>
              </button>

              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  currentTool === 'rectangle' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Rectangle"
              >
                <div className="w-6 h-6 border-2 border-blue-400 mb-1" />
                <span className="text-xs text-gray-300">Rectangle</span>
              </button>

              <button
                onClick={() => setCurrentTool('circle')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  currentTool === 'circle' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Circle"
              >
                <div className="w-6 h-6 border-2 border-blue-400 rounded-full mb-1" />
                <span className="text-xs text-gray-300">Circle</span>
              </button>

              <button
                onClick={() => setCurrentTool('line')}
                className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
                  currentTool === 'line' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Line"
              >
                <div className="w-6 h-6 flex items-center justify-center mb-1">
                  <div className="w-full border-b-2 border-blue-400" />
                </div>
                <span className="text-xs text-gray-300">Line</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setCurrentTool('brush')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'brush' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Brush"
              >
                <FiEdit3 className="w-5 h-5 text-blue-400" />
              </button>

              <button
                onClick={() => setCurrentTool('rectangle')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'rectangle' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Rectangle"
              >
                <div className="w-5 h-5 border-2 border-blue-400" />
              </button>

              <button
                onClick={() => setCurrentTool('circle')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'circle' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Circle"
              >
                <div className="w-5 h-5 border-2 border-blue-400 rounded-full" />
              </button>

              <button
                onClick={() => setCurrentTool('line')}
                className={`p-2 rounded-lg transition-colors ${
                  currentTool === 'line' ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="Line"
              >
                <div className="w-5 h-5 flex items-center">
                  <div className="w-full border-b-2 border-blue-400" />
                </div>
              </button>
            </div>
          )}

          {/* Color Picker */}
          <div className="space-y-3">
            {isExpanded && (
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <IoColorPaletteOutline className="w-5 h-5" />
                Color
              </h3>
            )}

            {!isExpanded ? (
              <div className="flex flex-col items-center gap-2">
                <IoColorPaletteOutline className="w-5 h-5 text-gray-400" />
                 <label
                   title={"Current Color: " + brushColor.slice(0, 7)}
                htmlFor="color-input"
                className="size-10 p-0 rounded-lg border-2 border-gray-600 cursor-pointer bg-transparent hover:border-blue-400 transition-colors"
                style={{ backgroundColor: brushColor.slice(0, 7) }}
              ></label>
              <input
                type="color"
                id="color-input"
                name="stroke-color"
                value={brushColor.slice(0, 7)}
                title={"Current Color: " + brushColor.slice(0, 7)}
                onChange={(e) => {
                  const newColor =
                    e.target.value + alpha.toString(16).padStart(2, "0");
                  setBrushColor(newColor);
                }}
                className="hidden"
              />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                  <label
                    title={"Current Color: " + brushColor.slice(0, 7)}
                htmlFor="color-input"
                className="size-10 p-0 rounded-lg border-2 border-gray-600 cursor-pointer bg-transparent hover:border-blue-400 transition-colors"
                style={{ backgroundColor: brushColor.slice(0, 7) }}
              ></label>
              <input
                type="color"
                id="color-input"
                name="stroke-color"
                value={brushColor.slice(0, 7)}
              
                onChange={(e) => {
                  const newColor =
                    e.target.value + alpha.toString(16).padStart(2, "0");
                  setBrushColor(newColor);
                }}
                className="hidden"
              />
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-1">Opacity: {Math.round((alpha / 255) * 100)}%</div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={alpha}
                    onChange={(e) => {
                      const newAlpha = parseInt(e.target.value);
                      setAlpha(newAlpha);
                      setBrushColor(
                        brushColor.slice(0, 7) + newAlpha.toString(16).padStart(2, "0"),
                      );
                    }}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}
            
            {isExpanded && recentColors.length > 0 && (
              <div>
                <span className="text-xs text-gray-500 mb-2 block">Recent Colors</span>
                <div className="flex flex-wrap gap-2">
                  {recentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setBrushColor(color)}
                      className="w-8 h-8 rounded-lg border-2 border-gray-600 hover:border-blue-400 transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Brush Size */}
          <div className="space-y-3">
            {isExpanded && (
              <h3 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <FiSliders className="w-5 h-5" />
                Brush Size
              </h3>
            )}

            {!isExpanded && (
              <div className="flex justify-center">
                <FiSliders className="w-5 h-5 text-gray-400" />
              </div>
            )}

            {isExpanded && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Size: {brushSize}px</span>
                  <div 
                    className="rounded-full bg-blue-400" 
                    style={{ 
                      width: `${Math.min(brushSize, 16)}px`, 
                      height: `${Math.min(brushSize, 16)}px` 
                    }}
                  />
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
                <div className="grid grid-cols-4 gap-1">
                  {brushSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                        brushSize === size
                          ? "bg-blue-600 text-white ring-2 ring-blue-400"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {size}
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
