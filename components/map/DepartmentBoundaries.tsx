"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { GeoJSON, Pane, useMap, useMapEvents } from "react-leaflet";
import type { FeatureCollection, Feature, Geometry } from "geojson";
import type { Layer, PathOptions, LeafletMouseEvent } from "leaflet";
import type L from "leaflet";
import type { DepartmentProperties } from "@/hooks/use-department-boundaries";
import { buildDepartmentKey } from "@/lib/geocode";

const BOUNDARY_PANE = "departmentBoundaries";
const BOUNDARY_Z_INDEX = 250;

const MIN_ZOOM_BOUNDARIES = 5;
const MIN_ZOOM_FILL = 7;

const DEFAULT_STYLE: PathOptions = {
  color: "#64748b",
  weight: 1,
  opacity: 0.4,
  fillColor: "#94a3b8",
  fillOpacity: 0,
  dashArray: "3 3",
};

const HOVER_STYLE: PathOptions = {
  color: "#2897D4",
  weight: 2,
  opacity: 0.7,
  fillColor: "#2897D4",
  fillOpacity: 0.08,
};

const SELECTED_STYLE: PathOptions = {
  color: "#2897D4",
  weight: 2.5,
  opacity: 0.9,
  fillColor: "#2897D4",
  fillOpacity: 0.15,
  dashArray: undefined,
};

function getBaseStyle(zoom: number): PathOptions {
  if (zoom >= MIN_ZOOM_FILL) {
    return { ...DEFAULT_STYLE, fillOpacity: 0.04 };
  }
  return DEFAULT_STYLE;
}

interface DepartmentBoundariesProps {
  geojson: FeatureCollection<Geometry, DepartmentProperties>;
  obraCounts?: Map<string, number>;
}

export default function DepartmentBoundaries({
  geojson,
  obraCounts,
}: DepartmentBoundariesProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  const selectedKeyRef = useRef<string | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);

  useMapEvents({
    zoomend: () => setZoom(map.getZoom()),
  });

  const visible = zoom >= MIN_ZOOM_BOUNDARIES;
  const baseStyle = getBaseStyle(zoom);

  // When zoom changes, update all layer styles (preserving selected)
  useEffect(() => {
    const geoJsonLayer = geoJsonRef.current;
    if (!geoJsonLayer) return;

    geoJsonLayer.eachLayer((layer: Layer) => {
      const feature = (
        layer as L.GeoJSON & {
          feature: Feature<Geometry, DepartmentProperties>;
        }
      ).feature;
      if (!feature) return;
      const key = buildDepartmentKey(
        feature.properties.provincia,
        feature.properties.departamento
      );
      if (key === selectedKeyRef.current) {
        (layer as L.Path).setStyle(SELECTED_STYLE);
      } else {
        (layer as L.Path).setStyle(baseStyle);
      }
    });
  }, [zoom, baseStyle]);

  const onEachFeature = useCallback(
    (feature: Feature<Geometry, DepartmentProperties>, layer: Layer) => {
      const props = feature.properties;
      const deptKey = buildDepartmentKey(props.provincia, props.departamento);
      const count = obraCounts?.get(deptKey) ?? 0;

      const tooltipContent =
        count > 0
          ? `<strong>${props.departamento}</strong><br/>${props.provincia}<br/>${count} obra${count !== 1 ? "s" : ""}`
          : `<strong>${props.departamento}</strong><br/>${props.provincia}`;

      layer.bindTooltip(tooltipContent, {
        sticky: true,
        className: "department-tooltip",
      });

      // Apply selected style if this layer matches the persisted selection
      if (deptKey === selectedKeyRef.current) {
        (layer as L.Path).setStyle(SELECTED_STYLE);
      }

      layer.on({
        mouseover: (e: LeafletMouseEvent) => {
          const target = e.target;
          const fProps = target.feature?.properties;
          if (!fProps) return;
          const key = buildDepartmentKey(fProps.provincia, fProps.departamento);
          if (key !== selectedKeyRef.current) {
            target.setStyle(HOVER_STYLE);
            target.bringToFront();
          }
        },
        mouseout: (e: LeafletMouseEvent) => {
          const target = e.target;
          const fProps = target.feature?.properties;
          if (!fProps) return;
          const key = buildDepartmentKey(fProps.provincia, fProps.departamento);
          if (key !== selectedKeyRef.current) {
            target.setStyle(getBaseStyle(map.getZoom()));
          }
        },
        click: (e: LeafletMouseEvent) => {
          const target = e.target;
          const fProps = target.feature?.properties;
          if (!fProps) return;
          const key = buildDepartmentKey(fProps.provincia, fProps.departamento);
          const currentZoom = map.getZoom();
          const currentBase = getBaseStyle(currentZoom);

          // Deselect previous
          if (selectedKeyRef.current && selectedKeyRef.current !== key) {
            geoJsonRef.current?.eachLayer((l: Layer) => {
              const lf = (
                l as L.GeoJSON & {
                  feature: Feature<Geometry, DepartmentProperties>;
                }
              ).feature;
              if (!lf) return;
              const lKey = buildDepartmentKey(
                lf.properties.provincia,
                lf.properties.departamento
              );
              if (lKey === selectedKeyRef.current) {
                (l as L.Path).setStyle(currentBase);
              }
            });
          }

          // Toggle selection
          if (selectedKeyRef.current === key) {
            target.setStyle(currentBase);
            selectedKeyRef.current = null;
          } else {
            target.setStyle(SELECTED_STYLE);
            target.bringToFront();
            selectedKeyRef.current = key;
          }
        },
      });
    },
    [obraCounts, map]
  );

  if (!visible) return null;

  return (
    <Pane name={BOUNDARY_PANE} style={{ zIndex: BOUNDARY_Z_INDEX }}>
      <GeoJSON
        ref={geoJsonRef}
        data={geojson}
        style={baseStyle}
        onEachFeature={onEachFeature}
        pane={BOUNDARY_PANE}
      />
    </Pane>
  );
}
