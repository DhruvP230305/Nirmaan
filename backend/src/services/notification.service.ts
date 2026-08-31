import { logger } from '../utils/logger.js';

export interface NotificationPayload {
  toEmail: string;
  subject: string;
  body: string;
}

export class NotificationService {
  /**
   * Send transactional email notification (Mock / Nodemailer integration ready)
   */
  static async sendEmail(payload: NotificationPayload): Promise<boolean> {
    logger.info(`[NOTIFICATION SERVICE] Sending email to ${payload.toEmail}`);
    logger.info(`[SUBJECT]: ${payload.subject}`);
    logger.info(`[BODY]: ${payload.body}`);
    return true;
  }

  /**
   * Send automated status update alerts (RFQ, Quote, Sample, Order, Payment)
   */
  static async sendStatusAlert(toEmail: string, type: 'RFQ' | 'QUOTE' | 'SAMPLE' | 'ORDER' | 'PAYMENT', title: string, status: string) {
    const subject = `[Status Update] Your ${type} "${title}" is now ${status}`;
    const body = `Hello,\n\nYour ${type} status has been updated to "${status}". Log into the dashboard for details.\n\nBest regards,\nD2C Sourcing Platform`;
    return this.sendEmail({ toEmail, subject, body });
  }
}
