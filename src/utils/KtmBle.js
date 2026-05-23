/**
 * KTM Bluetooth Logic
 * Ported from reverse-engineered KTM Mobile SDK
 */
import { Buffer } from 'buffer';
import { BleManager } from 'react-native-ble-plx';

export const KTM_UUIDS = {
  SERVICE_BCCU: '00001819-0000-1000-8000-00805f9b34fb',
  CHAR_NAV_DATA: '00002a67-0000-1000-8000-00805f9b34fb',
  SERVICE_KTM_CUSTOM: '65786b61-746d-206e-6176-692073646b21',
  CHAR_TURN_INFO: '65786b61-746d-206e-6176-692064617461'
};

export const DirectionIcons = {
  STRAIGHT: 1,
  LEFT: 2,
  RIGHT: 3,
  U_TURN: 4,
  SLIGHT_LEFT: 5,
  SLIGHT_RIGHT: 6,
  ROUNDABOUT: 7,
};

class KtmBleService {
  constructor() {
    this.manager = new BleManager();
    this.connectedDevice = null;
  }

  async scanAndConnect() {
    return new Promise((resolve, reject) => {
      this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          reject(error);
          return;
        }

        // Check for KTM name or specific service
        if (device.name?.includes('KTM') || device.name?.includes('BT-C')) {
          this.manager.stopDeviceScan();
          device.connect()
            .then((device) => device.discoverAllServicesAndCharacteristics())
            .then((device) => {
              this.connectedDevice = device;
              resolve(device);
            })
            .catch(reject);
        }
      });
    });
  }

  async sendNavigationUpdate(distance, direction, streetName) {
    if (!this.connectedDevice) return;

    const packet = KtmPacketizer.createTurnPacket(distance, direction, streetName);
    const base64Packet = packet.toString('base64');

    await this.connectedDevice.writeCharacteristicWithResponseForService(
      KTM_UUIDS.SERVICE_KTM_CUSTOM,
      KTM_UUIDS.CHAR_TURN_INFO,
      base64Packet
    );
  }
}

export const KtmPacketizer = {
  /**
   * Converts navigation data to the exact binary format the KTM TFT expects.
   * @param {number} distance - Distance in meters
   * @param {number} direction - Direction icon index
   * @param {string} streetName - Name of the street (Max 20 chars)
   */
  createTurnPacket(distance, direction, streetName) {
    const cleanStreet = streetName.substring(0, 20);
    const streetBuffer = Buffer.from(cleanStreet, 'utf-8');
    
    // Header (8 bytes): [Distance: 4 bytes (LE)] [Direction: 4 bytes (LE)]
    const header = Buffer.alloc(8);
    header.writeUInt32LE(distance, 0);
    header.writeUInt32LE(direction, 4);
    
    // Full packet: Header + Street Name
    return Buffer.concat([header, streetBuffer]);
  }
};

export const ktmBle = new KtmBleService();
