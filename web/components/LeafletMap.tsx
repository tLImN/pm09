"use client";

import { useEffect, useRef } from "react";

export default function LeafletMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    let map: unknown;
    const initMap = async () => {
      const L = await import("leaflet");

      // Динамически добавляем CSS Leaflet
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      // Исправляем пути иконок для работы с модульными сборщиками
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapRef.current && !mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map = (L as any).map(mapRef.current, { 
          attributionControl: false
        }).setView(
          [56.0967, 40.3477],
          18
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (L as any)
          .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 18,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          })
          .addTo(map);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const myAttrControl = (L as any).control.attribution().addTo(map);
        myAttrControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const marker = (L as any).marker([56.0967, 40.3477]).addTo(map);
        marker
          .bindPopup("ООО «Альтернатива Форклифт»")
          .openPopup();

        mapInstanceRef.current = map;
      }
    };

    initMap();

    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (mapInstanceRef.current && (mapInstanceRef.current as any).remove) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (mapInstanceRef.current as any).remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return <div id="map" ref={mapRef} style={{ height: 480, width: "100%" }} />;
}