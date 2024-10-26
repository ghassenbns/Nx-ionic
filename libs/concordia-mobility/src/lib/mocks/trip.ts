import { TripsDataInterface } from '@concordia-nx-ionic/concordia-mobility-api';

export const MOCK_TRIP_DATA: TripsDataInterface = {
  '_id': '652d56768064a2b8140c1ed2',
  'tripStatusId': 1,
  'actualStartDate': null,
  'actualEndDate': null,
  'waypoints': {
    'type': 'FeatureCollection',
    'features': [],
  },
  'name': '01',
  'description': '01',
  'fleetId': '652d14fced366092240d4e62',
  'vehicleId': '652d5491d035f06c0e0892f2',
  'plannedStartDate': 1697470020000,
  'plannedEndDate': 1698769620000,
  '_endDate': 1698769620000,
  'driverId': '652d1506cbd14cabc008a533',
  'updatedAt': 1697470070807,
  'createdAt': 1697470070807,
  'driverIds': [
    '652d1506cbd14cabc008a533',
  ],
  'vehicleIds': [
    '652d5491d035f06c0e0892f2',
  ],
  'fleetIds': [
    '652d14fced366092240d4e62',
  ],
  'isEditable': true,
  'isDeletable': true,
  'startLocation': null,
  'endLocation': null,
  'isWaypointsEditable': true,
  'fleetDetails': {
    '_id': '652d14fced366092240d4e62',
    'name': '0100',
    'isEditable': true,
    'isDeletable': false,
    'isOwnerEditable': true,
  },
  'vehicleDetails': {
    '_id': '652d5491d035f06c0e0892f2',
    'name': 'VEH 014',
    'description': '012',
    'vehicleTypeId': 1,
    'isActive': true,
    'vehicleFuelTypeId': 1,
    'isTravelling': false,
    'registrationNumber': '010',
    'fleetId': '652d14fced366092240d4e62',
    'updatedAt': 1697469585465,
    'createdAt': 1697469585465,
    'tripIds': [
      '652d56768064a2b8140c1ed2',
    ],
    'isEditable': true,
    'isDeletable': true,
    'nodesUsed': [],
    'eventsConfig': [],
    'signalsConfig': [],
  },
  'driverDetails': {
    '_id': '652d1506cbd14cabc008a533',
    'name': '01',
    'description': '01',
    'isActive': true,
    'isTravelling': false,
    'defaultVehicleId': null,
    'userId': null,
    'fleetId': '652d14fced366092240d4e62',
    'updatedAt': 1697468820294,
    'createdAt': 1697453318175,
    'fleetIds': [
      '652d14fced366092240d4e62',
    ],
    'tripIds': [
      '652d56768064a2b8140c1ed2',
    ],
    'isEditable': true,
    'isDeletable': true,
  },
  'tripStatusDetails': {
    'tripStatusId': 1,
    'status': 'NEW',
    'label': 'New',
  },
};
