// Map geometry methods for calculating Geofence hit-markers on MapView

import { Nullable } from '@root/types/common/types';
import { CoordinatesType } from '@screens/mapScreen/types';

export const toRadians = (n: number) => {
  return n * (Math.PI / 180);
};

export const toDegrees = (n: number) => {
  return n * (180 / Math.PI);
};

export const getBearing = (start: CoordinatesType, end: CoordinatesType) => {
  const startLat = toRadians(start.latitude);
  const startLong = toRadians(start.longitude);
  const endLat = toRadians(end.latitude);
  const endLong = toRadians(end.longitude);

  let dLong = endLong - startLong;

  const dPhi = Math.log(
    Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0),
  );

  if (Math.abs(dLong) > Math.PI) {
    if (dLong > 0.0) dLong = -(2.0 * Math.PI - dLong);
    else dLong = 2.0 * Math.PI + dLong;
  }

  return (toDegrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
};

export type ComputeOffsetCoordinateReturnType = Nullable<CoordinatesType>;

export const computeOffsetCoordinate = (
  coordinate: CoordinatesType,
  distance: number,
  heading: number,
): ComputeOffsetCoordinateReturnType => {
  const computedDistance = distance / (6371 * 1000);
  const radiansHeading = toRadians(heading);

  const lat1 = toRadians(coordinate.latitude);
  const lon1 = toRadians(coordinate.longitude);
  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(computedDistance) +
      Math.cos(lat1) * Math.sin(computedDistance) * Math.cos(radiansHeading),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(radiansHeading) * Math.sin(computedDistance) * Math.cos(lat1),
      Math.cos(computedDistance) - Math.sin(lat1) * Math.sin(lat2),
    );

  if (isNaN(lat2) || isNaN(lon2)) return null;

  return {
    latitude: toDegrees(lat2),
    longitude: toDegrees(lon2),
  };
};
