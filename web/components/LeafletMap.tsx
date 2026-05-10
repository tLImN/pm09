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
    const initMap = async () => {
      const L = await import("leaflet");

      // Динамически добавляем локальный CSS Leaflet
      await new Promise<void>((resolve) => {
        if (document.querySelector('link[href*="/css/leaflet.css"]')) {
          resolve();
          return;
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/css/leaflet.css";
        link.onload = () => resolve();
        document.head.appendChild(link);
      });

      if (mapRef.current && !mapInstanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const map = (L as any).map(mapRef.current, {
          attributionControl: false,
          // EPSG:3395 — проекция Яндекс-тайлов (Mercator на эллипсоиде)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          crs: (L as any).CRS.EPSG3395,
        }).setView([lat, lng], 16);

        const apiKey = process.env.NEXT_PUBLIC_YANDEX_TILES_API_KEY || "";

        // Кастомная атрибуция Leaflet (без флага «Leaflet»)
        const myAttrControl = (L as any).control.attribution().addTo(map);
        myAttrControl.setPrefix('<a href="https://leafletjs.com/">Leaflet</a>');

        // Яндекс Tiles API (core-renderer)
        (L as any)
          .tileLayer(
            `https://core-renderer-tiles.maps.yandex.net/tiles?l=map&lang=ru_RU&x={x}&y={y}&z={z}&apikey=${apiKey}`,
            {
              maxZoom: 23,
              attribution:
                '&copy; <a href="https://yandex.ru/maps/">Яндекс</a>',
            }
          )
          .addTo(map);

        // Логотип Яндекс.Карт (обязательно по правилам Tiles API)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const yandexLogo = (L as any).control({ position: "bottomleft" });
        yandexLogo.onAdd = function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const div = (L as any).DomUtil.create("div");
          div.innerHTML =
            '<a href="https://yandex.ru/maps/" target="_blank" rel="noopener noreferrer">' +
            '<img src="/yndex_logo_ru.svg" alt="Яндекс.Карты" style="height:72px;" />' +
            "</a>";
          return div;
        };
        yandexLogo.addTo(map);

        const markerIcon = (L as any).icon({
          iconUrl: "/img/markers/marker-icon-red.png",
          iconRetinaUrl: "/img/markers/marker-icon-2x-red.png",
          shadowUrl: "/img/markers/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const marker = (L as any)
          .marker([lat, lng], { icon: markerIcon })
          .addTo(map);
        marker.bindPopup(popupText);

        mapInstanceRef.current = map;

        // Открываем popup после того как браузер применит стили и пересчитает layout
        requestAnimationFrame(() => {
          setTimeout(() => {
            (map as { invalidateSize: () => void }).invalidateSize();
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