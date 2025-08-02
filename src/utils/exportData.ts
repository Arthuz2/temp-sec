
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Temperature {
  data: string;
  valor: number;
}

interface DryingSession {
  id: string;
  startDate: Date;
  endDate: Date;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  duration: number;
  status: string;
}

export const exportToCSV = async (data: Temperature[], sessions: DryingSession[]) => {
  try {
    // Criar conteúdo CSV para temperaturas
    let csvContent = 'Data/Hora,Temperatura (°C)\n';
    data.forEach(temp => {
      const formattedDate = format(new Date(temp.data), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });
      csvContent += `${formattedDate},${temp.valor}\n`;
    });

    // Adicionar dados de sessões
    csvContent += '\n\nSessões de Secagem\n';
    csvContent += 'ID,Data Início,Data Fim,Temp. Média,Temp. Máx,Temp. Mín,Duração (min),Status\n';

    sessions.forEach(session => {
      const startDate = format(session.startDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      const endDate = format(session.endDate, 'dd/MM/yyyy HH:mm', { locale: ptBR });
      csvContent += `${session.id},${startDate},${endDate},${session.avgTemperature},${session.maxTemperature},${session.minTemperature},${session.duration},${session.status}\n`;
    });

    // Salvar arquivo
    const fileName = `tempsec_dados_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.csv`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Exportar dados TempSec',
      });
    }

    return { success: true, fileName };
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return { success: false, error: (error as Error).message };
  }
};

export const generatePDFReport = async (data: Temperature[], sessions: DryingSession[]) => {
  try {
    // Criar conteúdo HTML para PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Relatório TempSec</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats { display: flex; justify-content: space-around; margin-bottom: 20px; }
            .stat-card { text-align: center; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TempSec - Relatório de Monitoramento</h1>
            <p>Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}</p>
          </div>
          
          <div class="section">
            <h2>Resumo Estatístico</h2>
            <div class="stats">
              <div class="stat-card">
                <h3>${Math.max(...data.map(t => t.valor)).toFixed(1)}°C</h3>
                <p>Temperatura Máxima</p>
              </div>
              <div class="stat-card">
                <h3>${Math.min(...data.map(t => t.valor)).toFixed(1)}°C</h3>
                <p>Temperatura Mínima</p>
              </div>
              <div class="stat-card">
                <h3>${(data.reduce((acc, t) => acc + t.valor, 0) / data.length).toFixed(1)}°C</h3>
                <p>Temperatura Média</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Sessões de Secagem</h2>
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Duração</th>
                  <th>Temp. Média</th>
                  <th>Temp. Máx</th>
                  <th>Temp. Mín</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${sessions.map(session => `
                  <tr>
                    <td>${format(session.startDate, 'dd/MM/yyyy', { locale: ptBR })}</td>
                    <td>${Math.floor(session.duration / 60)}h ${session.duration % 60}min</td>
                    <td>${session.avgTemperature.toFixed(1)}°C</td>
                    <td>${session.maxTemperature.toFixed(1)}°C</td>
                    <td>${session.minTemperature.toFixed(1)}°C</td>
                    <td>${session.status === 'completed' ? 'Concluída' : session.status === 'interrupted' ? 'Interrompida' : 'Em andamento'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;

    const fileName = `tempsec_relatorio_${format(new Date(), 'yyyy-MM-dd_HH-mm-ss')}.html`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Compartilhar arquivo
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/html',
        dialogTitle: 'Exportar relatório TempSec',
      });
    }

    return { success: true, fileName };
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return { success: false, error: (error as Error).message };
  }
};
