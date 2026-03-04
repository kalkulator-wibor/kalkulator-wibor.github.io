import type { AppModule } from '../types';
import { FileText } from 'lucide-react';
import TemplatesPanel from './TemplatesPanel';

const templates: AppModule = {
  id: 'templates',
  label: 'Wzory umów',
  description: 'Szablony umów kredytowych z danymi banków',
  icon: FileText,
  type: 'sheet',
  Component: TemplatesPanel,
  alwaysEnabled: true,
  showInHeader: false,
};

export default templates;
