import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useThemeColors } from '../../hooks/useThemeColors';

export interface LeafletMapRef {
  fitBounds: (points: Array<{latitude: number, longitude: number}>, padding?: {top: number, right: number, bottom: number, left: number}) => void;
  animateToRegion: (region: {latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number}, duration?: number) => void;
}

interface LeafletMapProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  mapType?: 'standard' | 'satellite';
  route?: Array<{latitude: number, longitude: number}>;
  checkpoints?: Array<{
    id: number;
    latitude: number;
    longitude: number;
    title: string;
    description: string;
    visited: boolean;
  }>;
  userLocation?: {latitude: number, longitude: number} | null;
  onMapReady?: () => void;
  style?: object;
}

const LeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>((props, ref) => {
  const {
    initialRegion,
    mapType = 'standard',
    route = [],
    checkpoints = [],
    userLocation = null,
    onMapReady,
    style
  } = props;
  
  const webViewRef = useRef<WebView>(null);
  const colors = useThemeColors();
  const isDark = colors.isDark;

  useImperativeHandle(ref, () => ({
    fitBounds: (points, padding = {top: 100, right: 100, bottom: 100, left: 100}) => {
      const message = JSON.stringify({
        type: 'fitBounds',
        points,
        padding
      });
      webViewRef.current?.postMessage(message);
    },
    animateToRegion: (region, duration = 1000) => {
      const message = JSON.stringify({
        type: 'animateToRegion',
        region,
        duration
      });
      webViewRef.current?.postMessage(message);
    }
  }));

  const generateHTML = () => {
    const routePoints = route.map(point => [point.latitude, point.longitude]);
    
    const checkpointMarkers = checkpoints.map(checkpoint => {
      return {
        id: checkpoint.id,
        position: [checkpoint.latitude, checkpoint.longitude],
        title: checkpoint.title,
        description: checkpoint.description,
        visited: checkpoint.visited
      };
    });

    const userLocationData = userLocation ? {
      position: [userLocation.latitude, userLocation.longitude],
      title: 'Votre position',
      description: 'Vous êtes ici'
    } : null;

    const primaryColor = colors.primary;
    const successColor = colors.success;
    const textColor = colors.text;
    const cardColor = colors.card;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
          }
          .visited-marker {
            background-color: ${successColor};
            border: 2px solid ${textColor};
            width: 32px;
            height: 32px;
            border-radius: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .pending-marker {
            background-color: ${cardColor};
            border: 2px solid ${primaryColor};
            width: 32px;
            height: 32px;
            border-radius: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .user-location-marker {
            width: 40px;
            height: 40px;
            border-radius: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .leaflet-control-attribution {
            display: none !important;
          }
          .gmnoprint, .gm-style, .gm-style-cc, .gm-style div a div img, 
          .gm-style-pbc, .gm-style div a, .gm-style div, .gmnoscreen {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          .mapboxgl-ctrl-attrib, .mapbox-improve-map, 
          .mapboxgl-ctrl-logo, .maplibregl-ctrl-attrib {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([${initialRegion.latitude}, ${initialRegion.longitude}], 14);
          
          if ('${mapType}' === 'satellite') {
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
              attribution: '',
              maxZoom: 19
            }).addTo(map);
          } else {
            const tileLayer = ${isDark} ? 
              L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '',
                maxZoom: 19
              }) : 
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '',
                maxZoom: 19
              });
            tileLayer.addTo(map);
          }

          document.querySelectorAll('.leaflet-control-attribution').forEach(el => el.remove());

          let userLocationMarker = null;
          
          if (${routePoints.length > 0}) {
            const polyline = L.polyline(${JSON.stringify(routePoints)}, {
              color: '${primaryColor}',
              weight: 4
            }).addTo(map);
          }
          
          const markers = ${JSON.stringify(checkpointMarkers)}.map(marker => {
            const customIcon = L.divIcon({
              className: marker.visited ? 'visited-marker' : 'pending-marker',
              html: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + 
                   (marker.visited ? '${textColor}' : '${primaryColor}') + 
                   '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z"></path><path d="M12 10v4"></path><path d="M12 14h.01"></path></svg>',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });
            
            return L.marker([marker.position[0], marker.position[1]], { icon: customIcon })
              .addTo(map)
              .bindPopup('<b>' + marker.title + '</b><br>' + marker.description);
          });
          
          if (${userLocation !== null}) {
            userLocationMarker = L.marker([${userLocation?.latitude}, ${userLocation?.longitude}], {
              icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div style="width: 30px; height: 30px; background-color: #60A5FA; border-radius: 15px; border: 2px solid white;"></div>',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
              })
            }).addTo(map).bindPopup('Votre position');
            
            map.setView([${userLocation?.latitude}, ${userLocation?.longitude}], 16);
          }
          
          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              
              if (data.type === 'fitBounds') {
                const points = data.points.map(p => [p.latitude, p.longitude]);
                if (points.length > 0) {
                  map.fitBounds(points, { padding: [data.padding.top, data.padding.right, data.padding.bottom, data.padding.left] });
                }
              } else if (data.type === 'animateToRegion') {
                const zoom = calculateZoomLevel(data.region.latitudeDelta);
                map.flyTo(
                  [data.region.latitude, data.region.longitude],
                  zoom,
                  {
                    duration: data.duration/1000,
                    easeLinearity: 0.5
                  }
                );
              } else if (data.type === 'updateUserLocation') {
                if (userLocationMarker) {
                  userLocationMarker.setLatLng([data.location.latitude, data.location.longitude]);
                  map.flyTo([data.location.latitude, data.location.longitude], 16, {
                    duration: 0.5,
                    easeLinearity: 0.5
                  });
                } else {
                  userLocationMarker = L.marker([data.location.latitude, data.location.longitude], {
                    icon: L.divIcon({
                      className: 'user-location-marker',
                      html: '<div style="width: 30px; height: 30px; background-color: #60A5FA; border-radius: 15px; border: 2px solid white;"></div>',
                      iconSize: [40, 40],
                      iconAnchor: [20, 20]
                    })
                  }).addTo(map).bindPopup('Votre position');
                  
                  map.setView([data.location.latitude, data.location.longitude], 16);
                }
              }
            } catch (error) {
              console.error('Error processing message in map:', error);
            }
          });
          
          function calculateZoomLevel(latitudeDelta) {
            return Math.max(16, Math.round(Math.log2(360 / latitudeDelta) - 1));
          }
          
          map.attributionControl.remove();
          
          window.onload = function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
          };
        </script>
      </body>
      </html>
    `;
  };

  useEffect(() => {
    if (webViewRef.current && userLocation) {
      const message = JSON.stringify({
        type: 'updateUserLocation',
        location: userLocation
      });
      webViewRef.current.postMessage(message);
    }
  }, [userLocation]);

  const onMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapReady' && onMapReady) {
        onMapReady();
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: generateHTML() }}
        style={styles.webview}
        onMessage={onMessage}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default LeafletMap;
