export interface LocationData {
    timestamp: number;
    location: {
        type: 'Point';
        coordinates: [number, number];
    }
}
