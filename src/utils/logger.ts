import fs from 'fs';

export function writeLog(logFile: string, message: string) {
  try {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logFile, logLine);
  } catch (err) {
    // Silent fail for logs
  }
}

export function readLogs(logFile: string): string[] {
  try {
    if (!fs.existsSync(logFile)) return [];
    const content = fs.readFileSync(logFile, 'utf8');
    return content.split('\n').filter(Boolean);
  } catch (err) {
    return [];
  }
}

export function clearLogs(logFile: string) {
  try {
    if (fs.existsSync(logFile)) {
      fs.writeFileSync(logFile, '');
    }
  } catch (err) {}
}
