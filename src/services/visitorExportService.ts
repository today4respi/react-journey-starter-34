
import * as XLSX from 'xlsx';
import { Visitor, VisitorStats } from '@/services/adminVisitorService';

export interface ExportData {
  visitors: Visitor[];
  stats: VisitorStats;
}

export const exportVisitorsToExcel = (data: ExportData) => {
  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Prepare visitor data for export
  const visitorData = data.visitors.map(visitor => ({
    'Adresse IP': visitor.ip_address,
    'Page Visitée': visitor.page_visited,
    'Référent': visitor.referrer || 'Direct',
    'Appareil': getDeviceType(visitor.user_agent),
    'Ville': visitor.city || 'Inconnu',
    'Pays': visitor.country || 'Inconnu',
    'Date de Visite': new Date(visitor.visit_date).toLocaleString('fr-FR'),
    'Session ID': visitor.session_id
  }));

  // Create visitors worksheet
  const visitorsWS = XLSX.utils.json_to_sheet(visitorData);
  XLSX.utils.book_append_sheet(workbook, visitorsWS, 'Visiteurs');

  // Create statistics worksheet
  const statsData = [
    { 'Métrique': 'Pages Vues Totales', 'Valeur': data.stats.total_visits },
    { 'Métrique': 'Sessions Uniques', 'Valeur': data.stats.unique_sessions },
    { 'Métrique': 'Visiteurs Uniques', 'Valeur': data.stats.unique_visitors },
    { 'Métrique': 'Pays Uniques', 'Valeur': data.stats.unique_countries },
    { 'Métrique': "Visites Aujourd'hui", 'Valeur': data.stats.today_visits }
  ];
  const statsWS = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(workbook, statsWS, 'Statistiques');

  // Create country distribution data
  const countryStats = data.visitors.reduce((acc, visitor) => {
    const country = visitor.country || 'Inconnu';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryData = Object.entries(countryStats)
    .sort(([, a], [, b]) => b - a)
    .map(([country, count]) => ({
      'Pays': country,
      'Nombre de Visites': count,
      'Pourcentage': ((count / data.visitors.length) * 100).toFixed(2) + '%'
    }));

  const countryWS = XLSX.utils.json_to_sheet(countryData);
  XLSX.utils.book_append_sheet(workbook, countryWS, 'Distribution par Pays');

  // Create pages popularity data
  const pageStats = data.visitors.reduce((acc, visitor) => {
    const page = visitor.page_visited;
    acc[page] = (acc[page] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pageData = Object.entries(pageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10) // Top 10 pages
    .map(([page, count]) => ({
      'Page': page,
      'Nombre de Visites': count,
      'Pourcentage': ((count / data.visitors.length) * 100).toFixed(2) + '%'
    }));

  const pagesWS = XLSX.utils.json_to_sheet(pageData);
  XLSX.utils.book_append_sheet(workbook, pagesWS, 'Pages Populaires');

  // Generate filename with current date
  const now = new Date();
  const filename = `visiteurs_${now.getFullYear()}_${(now.getMonth() + 1).toString().padStart(2, '0')}_${now.getDate().toString().padStart(2, '0')}.xlsx`;

  // Save the file
  XLSX.writeFile(workbook, filename);
};

const getDeviceType = (userAgent: string): string => {
  if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
    return 'Mobile';
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    return 'iOS';
  } else if (userAgent.includes('Macintosh')) {
    return 'Mac';
  } else if (userAgent.includes('Windows')) {
    return 'Windows';
  } else if (userAgent.includes('Linux')) {
    return 'Linux';
  }
  return 'Unknown';
};
