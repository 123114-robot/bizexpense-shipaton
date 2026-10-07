import { Platform } from 'react-native';
import { csvExportFileName } from './csv-export-name';

export async function saveCsvExport(csv: string): Promise<void> {
  const name = csvExportFileName();
  if (Platform.OS === 'web') {
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
    return;
  }

  const [{ File, Paths }, Sharing] = await Promise.all([import('expo-file-system'), import('expo-sharing')]);
  if (!await Sharing.isAvailableAsync()) throw new Error('File sharing is not available on this device.');
  const file = new File(Paths.cache, `${Date.now()}-${name}`);
  file.create();
  file.write(csv);
  await Sharing.shareAsync(file.uri, { dialogTitle: 'Export BizExpense CSV', mimeType: 'text/csv', UTI: 'public.comma-separated-values-text' });
}
