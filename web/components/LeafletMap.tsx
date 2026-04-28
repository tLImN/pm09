"use client";

import { useEffect, useRef } from "react";

interface LeafletMapProps {
  lat?: number;
  lng?: number;
  popupText?: string;
}

export default function LeafletMap({
  lat = 56.0967,
  lng = 40.3477,
  popupText = "ООО «Альтернатива Форклифт»",
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    let map: unknown;
      const initMap = async () => {
      const L = await import("leaflet");

      // Динамически добавляем CSS Leaflet и ждём его полной загрузки
      await new Promise<void>((resolve) => {
        if (document.querySelector('link[href*="leaflet.css"]')) {
          resolve();
          return;
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.onload = () => resolve();
        document.head.appendChild(link);
      });

      if (mapRef.current && !mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        map = (L as any).map(mapRef.current, { 
          attributionControl: false
        }).setView(
          [lat, lng],
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

        const markerIcon = (L as any).icon({
          iconUrl: "/img/markers/marker-icon-red.png",
          iconRetinaUrl: "/img/markers/marker-icon-2x-red.png",
          shadowUrl: "/img/markers/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const marker = (L as any).marker([lat, lng], { icon: markerIcon }).addTo(map);
        marker.bindPopup(popupText);

        mapInstanceRef.current = map;

        // Открываем popup после того как браузер применит стили и пересчитает layout
        requestAnimationFrame(() => {
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (map as any).invalidateSize();
            marker.openPopup();
          }, 100);
        });
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