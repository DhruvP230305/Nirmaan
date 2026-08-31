type LogLevel = 'info' | 'warn' | 'error';

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  }

  public info(message: string, ...args: any[]): void {
    console.log(this.formatMessage('info', message), ...args);
  }

  public warn(message: string, ...args: any[]): void {
    console.warn(this.formatMessage('warn', message), ...args);
  }

  public error(message: string, error?: any, ...args: any[]): void {
    console.error(this.formatMessage('error', message), ...args);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    } else if (error) {
      console.error(error);
    }
  }
}

export const logger = new Logger();
