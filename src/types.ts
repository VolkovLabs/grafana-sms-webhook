/**
 * Grafana Notification Payload
 */
export interface GrafanaNotificationPayload {
  /**
   * Message
   *
   * @type {string}
   */
  message: string;

  /**
   * Another properties
   */
  [key: string]: unknown;
}
