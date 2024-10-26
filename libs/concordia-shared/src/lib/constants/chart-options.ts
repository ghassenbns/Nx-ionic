export const CHART_OPTIONS = {
  type: 'scatter',
  animation: {
    duration: 0,
  },
  plugins: {
    tooltip: {
      mode: 'index',
      intersect: false,
    },
    title: {},
    crosshair: {
      sync: {
        enabled: true,
        group: 1,
        suppressTooltips: true,
      },
      zoom: {
        enabled: true,
        zoomboxBackgroundColor: 'rgba(66,133,244,0.2)',
        zoomboxBorderColor: '#48F',
        zoomButtonText: 'Reset Zoom',
        zoomButtonClass: 'reset-zoom',
      },
      callbacks: {
        beforeZoom: () => function() {                  // called before zoom, return false to prevent zoom
          return true;
        },
        afterZoom: () => function() {                   // called after zoom
        },
      },
    },
  },
  scales: {},
};
