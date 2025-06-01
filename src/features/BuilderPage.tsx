import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Download, Upload, Eye, EyeOff, ArrowLeft } from "lucide-react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  rectIntersection,
} from "@dnd-kit/core";
import { saveAs } from "file-saver";
import Canvas from "../components/Canvas";
import DraggablePanel from "../components/DraggablePanel";
import { v4 as uuidv4 } from "uuid";
import type { ComponentData, ComponentType } from "../types";
import DynamicForm from "../components/DynamicForm";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from "framer-motion";

type BuilderConfig = {
  id: string;
  name: string;
  components: ComponentData[];
  createdAt: string;
  grid?: {
    rows: number | 12;
    columns: number | 4;
  };
};

export default function BuilderPage() {
  const { id } = useParams();
  const [config, setConfig] = useState<BuilderConfig | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const gridRef = useRef<HTMLDivElement>(null);
  const pointerPosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const components = config?.components || [];
  const _config = useRef(config);

  const setComponents = (
    updater: (prev: Array<ComponentData>) => Array<ComponentData>
  ) => {
    setConfig((prevConfig) => {
      if (!prevConfig) return null;
  
      const newComponents = updater(prevConfig.components);
      console.log(newComponents)
  
      return {
        ...prevConfig,
        components: newComponents,
      };
    });
  };

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointerPosition.current = { x: event.clientX, y: event.clientY };
    };
  
    window.addEventListener("pointermove", updatePointer);
  
    return () => window.removeEventListener("pointermove", updatePointer);
  }, []);
  

  // Load the config on mount
  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(`builder-config-${id}`);
    if (stored) {
      setConfig(JSON.parse(stored));
    }
  }, [id]);

  useEffect(() => {
    localStorage.setItem('selectedId', selectedId || '');
  }, [selectedId]);

  useEffect(() => {
    if (JSON.stringify(config) !== JSON.stringify(_config.current)) {
      const stringConfig = localStorage.getItem(`builder-config-${id}`)
      const jsonConfig = stringConfig ? JSON.parse(stringConfig) : {}
      localStorage.setItem(`builder-config-${id}`,
      JSON.stringify({ ...jsonConfig, ...config }));
    _config.current = config;
  }
  }, [config, id]);

  if (!config) return <div className="p-4">Loading page...</div>;
  if (!id) return <div className="p-4">Missing builder ID in URL.</div>;

  const handleExport = () => {
    const json = JSON.stringify(components, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    saveAs(blob, `dashboard-config-${id}.json`);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (previewMode) return;
  
    const { active, over } = event;
    if (!over) return;
  
    if (!gridRef.current) {
      console.warn("Grid ref missing");
      return;
    }
  
    let col = 0;
    let row = 0;
  
    // Fallback: parse over.id if it matches cell pattern
    const overId = over.id as string;
    const cellMatch = overId.match(/^cell-(\d+)-(\d+)$/);
    if (cellMatch) {
      const parsedRow = parseInt(cellMatch[1], 10);
      const parsedCol = parseInt(cellMatch[2], 10);
      row = parsedRow;
      col = parsedCol;
    }
    const isNewComponent = (id: string) => id.startsWith("sidebar-");
  
    const newComponentType = isNewComponent(active.id as string)
      ? (active.id as string).replace("sidebar-", "") as ComponentType
      : null;
  
    const createComponent = (): ComponentData => ({
      id: uuidv4(),
      type: newComponentType!,
      label: newComponentType!.charAt(0).toUpperCase() + newComponentType!.slice(1) + " Label",
      placeholder: newComponentType === "text" ? "Enter text..." : undefined,
      layout: newComponentType === "container" ? "column" : undefined,
      children: newComponentType === "container" ? [] : undefined,
      options: [],
      gridPosition: { row, col },
      rowSpan: 1,
      colSpan: 1,
    });
  
    const moveComponent = (comps: ComponentData[], id: string): ComponentData[] => {
      return comps.map(c =>
        c.id === id
          ? { ...c, gridPosition: { row, col } }
          : c
      );
    };
  
    setComponents(prev => {
      if (newComponentType) {
        const newComp = createComponent();
        return [...prev, newComp];
      }
      return moveComponent(prev, active.id as string);
    });
  
    setSelectedId('');
    localStorage.setItem('selectedId', '');
  };  
  
  
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (Array.isArray(data)) {
          const newConfig = {
            ...config,
            components: data,
          };
          setConfig(newConfig);
          localStorage.setItem(`builder-config-${id}`, JSON.stringify(newConfig));
        } else {
          alert("Invalid JSON format.");
        }
      } catch {
        alert("Failed to parse JSON.");
      }
    };
    reader.readAsText(file);
  };

  const sanitizeColorClasses = (el: HTMLElement) => {
    const classList = Array.from(el.classList);
    const safeClasses = classList.filter(
      (cls) =>
        !/^bg-/.test(cls) &&
        !/^text-/.test(cls) &&
        !/^border-/.test(cls) &&
        !/^ring-/.test(cls) &&
        !/^fill-/.test(cls) &&
        !/^stroke-/.test(cls) &&
        !/^from-/.test(cls) &&
        !/^via-/.test(cls) &&
        !/^to-/.test(cls) &&
        !/^shadow-/.test(cls)
    );
  
    el.className = safeClasses.join(' ');
  };
  
  const captureSanitizedFormPdf = async () => {
    if (!formRef.current) return;
  
    // Clone the form node
    const clone = formRef.current.cloneNode(true) as HTMLElement;
  
    // Strip only color-related Tailwind classes
    clone.querySelectorAll<HTMLElement>('*').forEach((el) => sanitizeColorClasses(el));
  
    // Optionally inject custom fallback colors via inline style
    clone.style.backgroundColor = '#1E2A38';
    clone.style.color = 'white';
  
    const hiddenWrapper = document.createElement('div');
    hiddenWrapper.style.position = 'fixed';
    hiddenWrapper.style.left = '-9999px';
    hiddenWrapper.appendChild(clone);
    document.body.appendChild(hiddenWrapper);
  
    try {
      const canvas = await html2canvas(clone, {
        backgroundColor: '#1E2A38',
        useCORS: true,
      });
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('form.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      document.body.removeChild(hiddenWrapper);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      {/* Gradient Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-white hover:text-white/80 transition"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </button>
        <h2 className="text-2xl font-bold tracking-wide">{config.name}</h2>
      </div>

      <button
        onClick={() => {
          setSelectedId("");
          setPreviewMode((prev) => !prev);
        }}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg backdrop-blur transition"
      >
        {previewMode ? <EyeOff size={18} /> : <Eye size={18} />}
        {previewMode ? "Exit Preview" : "Preview Mode"}
      </button>
    </header>
  
      {/* Action Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700">
      {previewMode ?
      <div className="mt-4">
      <button
        onClick={captureSanitizedFormPdf}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download PDF
      </button>
    </div>
      :
      <>
        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow transition"
          >
            <Download size={16} />
            Export
          </button>
  
          <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow cursor-pointer transition">
            <Upload size={16} />
            Import
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>
  
        {/* Grid Settings */}
        <div className="flex items-center gap-6 bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-xl shadow-inner ring-1 ring-slate-200 dark:ring-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Rows:</span>
          <input
            type="number"
            min={1}
            value={config?.grid?.rows || 12}
            onChange={(e) => {
              const rows = parseInt(e.target.value) || 12;
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      grid: {
                        ...prev.grid,
                        rows,
                        columns: prev.grid?.columns || 4,
                      },
                    }
                  : prev
              );
            }}
            className="w-20 px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">Cols:</span>
          <input
            type="number"
            min={1}
            value={config?.grid?.columns || 4}
            onChange={(e) => {
              const columns = parseInt(e.target.value) || 4;
              setConfig((prev) =>
                prev
                  ? {
                      ...prev,
                      grid: {
                        ...prev.grid,
                        columns,
                        rows: prev.grid?.rows || 12,
                      },
                    }
                  : prev
              );
            }}
            className="w-20 px-3 py-2 text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
        </div>
        </>}
      </div>
  
      {/* Main Layout */}
      <AnimatePresence mode="wait">
        {!previewMode ? (
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 overflow-hidden"
          >
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              collisionDetection={rectIntersection}
            >
              <DraggablePanel onAddComponent={(newComponent: any) => console.log(newComponent)} />
              <Canvas
                previewMode={previewMode}
                config={config}
                setConfig={setConfig}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                gridRef={gridRef}
              />
            </DndContext>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-1 justify-center items-start pt-20 p-6 bg-slate-100 dark:bg-slate-900 overflow-auto"
          >
            <div className="w-full max-w-3xl bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <DynamicForm config={config} formRef={formRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
}
